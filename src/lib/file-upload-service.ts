import AWS from 'aws-sdk';
import { supabase } from './supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedAt: Date;
  userId: string;
  category?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface FileUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  category?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export class FileUploadService {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'text/plain',
  ];

  // Validate file before upload
  static validateFile(file: Express.Multer.File, options: FileUploadOptions = {}): { valid: boolean; error?: string } {
    const maxSize = options.maxSize || this.MAX_FILE_SIZE;
    const allowedTypes = options.allowedTypes || this.ALLOWED_TYPES;

    if (file.size > maxSize) {
      return { valid: false, error: `File size exceeds maximum limit of ${maxSize / 1024 / 1024}MB` };
    }

    if (!allowedTypes.includes(file.mimetype)) {
      return { valid: false, error: `File type ${file.mimetype} is not allowed` };
    }

    return { valid: true };
  }

  // Upload file to S3
  static async uploadToS3(
    file: Express.Multer.File,
    userId: string,
    options: FileUploadOptions = {}
  ): Promise<{ success: boolean; file?: UploadedFile; error?: string }> {
    try {
      // Validate file
      const validation = this.validateFile(file, options);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.originalname.split('.').pop();
      const uniqueFilename = `${userId}/${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

      // Upload to S3
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: uniqueFilename,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalName: file.originalname,
          uploadedBy: userId,
          category: options.category || 'general',
          ...options.metadata,
        },
      };

      const uploadResult = await s3.upload(uploadParams).promise();

      // Save file record to database
      const { data: document, error: insertError } = await supabase
        .from('documents')
        .insert({
          file_name: uniqueFilename,
          name: file.originalname,
          file_size: file.size,
          file_type: file.mimetype,
          file_path: uploadResult.Location,
          description: options.category || 'general',
          tags: options.tags || [],
          user_id: userId,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error saving document to database:', insertError);
        return { success: false, error: 'Failed to save file record' };
      }

      const uploadedFile: UploadedFile = {
        id: document.id,
        filename: document.file_name,
        originalName: document.name,
        size: document.file_size,
        mimeType: document.file_type,
        url: document.file_path,
        uploadedAt: new Date(document.created_at),
        userId: document.user_id,
        category: document.description,
        tags: document.tags as string[],
        metadata: {} as Record<string, any>,
      };

      return { success: true, file: uploadedFile };
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Get file by ID
  static async getFile(fileId: string, userId: string): Promise<{ success: boolean; file?: UploadedFile; error?: string }> {
    try {
      const { data: document, error: findError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', fileId)
        .eq('user_id', userId)
        .single();

      if (findError || !document) {
        return { success: false, error: 'File not found' };
      }

      const file: UploadedFile = {
        id: document.id,
        filename: document.file_name,
        originalName: document.name,
        size: document.file_size,
        mimeType: document.file_type,
        url: document.file_path,
        uploadedAt: new Date(document.created_at),
        userId: document.user_id,
        category: document.description,
        tags: document.tags as string[],
        metadata: {} as Record<string, any>,
      };

      return { success: true, file };
    } catch (error) {
      console.error('Error getting file:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Get files by user
  static async getUserFiles(
    userId: string,
    options: {
      category?: string;
      tags?: string[];
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{ success: boolean; files?: UploadedFile[]; total?: number; error?: string }> {
    try {
      const { category, tags, page = 1, limit = 20 } = options;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from('documents')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (category) {
        query = query.eq('description', category);
      }

      if (tags && tags.length > 0) {
        // Note: Supabase doesn't have a direct equivalent to Prisma's hasSome
        // This is a simplified implementation
        query = query.overlaps('tags', tags);
      }

      const { data: documents, error: findError, count } = await query;

      if (findError) {
        console.error('Error fetching documents:', findError);
        return { success: false, error: 'Failed to fetch files' };
      }

      const files: UploadedFile[] = (documents || []).map(doc => ({
        id: doc.id,
        filename: doc.file_name,
        originalName: doc.name,
        size: doc.file_size,
        mimeType: doc.file_type,
        url: doc.file_path,
        uploadedAt: new Date(doc.created_at),
        userId: doc.user_id,
        category: doc.description,
        tags: doc.tags as string[],
        metadata: {} as Record<string, any>,
      }));

      return { success: true, files, total: count || 0 };
    } catch (error) {
      console.error('Error getting user files:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Delete file
  static async deleteFile(fileId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: document, error: findError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', fileId)
        .eq('user_id', userId)
        .single();

      if (findError || !document) {
        return { success: false, error: 'File not found' };
      }

      // Delete from S3
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: document.file_name,
      };

      await s3.deleteObject(deleteParams).promise();

      // Delete from database
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', fileId);

      if (deleteError) {
        console.error('Error deleting document from database:', deleteError);
        return { success: false, error: 'Failed to delete file record' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Update file metadata
  static async updateFileMetadata(
    fileId: string,
    userId: string,
    updates: {
      category?: string;
      tags?: string[];
      metadata?: Record<string, any>;
    }
  ): Promise<{ success: boolean; file?: UploadedFile; error?: string }> {
    try {
      const document = await prisma.document.findFirst({
        where: {
          id: fileId,
          userId,
        },
      });

      if (!document) {
        return { success: false, error: 'File not found' };
      }

      const updatedDocument = await prisma.document.update({
        where: { id: fileId },
        data: {
          category: updates.category,
          tags: updates.tags,
          metadata: {
            ...document.metadata,
            ...updates.metadata,
          },
        },
      });

      const file: UploadedFile = {
        id: updatedDocument.id,
        filename: updatedDocument.filename,
        originalName: updatedDocument.originalName,
        size: updatedDocument.size,
        mimeType: updatedDocument.mimeType,
        url: updatedDocument.url,
        uploadedAt: updatedDocument.createdAt,
        userId: updatedDocument.userId,
        category: updatedDocument.category,
        tags: updatedDocument.tags as string[],
        metadata: updatedDocument.metadata as Record<string, any>,
      };

      return { success: true, file };
    } catch (error) {
      console.error('Error updating file metadata:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Generate presigned URL for secure file access
  static async generatePresignedUrl(
    fileId: string,
    userId: string,
    expiresIn: number = 3600
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const document = await prisma.document.findFirst({
        where: {
          id: fileId,
          userId,
        },
      });

      if (!document) {
        return { success: false, error: 'File not found' };
      }

      const params = {
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: document.filename,
        Expires: expiresIn,
      };

      const presignedUrl = await s3.getSignedUrlPromise('getObject', params);

      return { success: true, url: presignedUrl };
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
} 
