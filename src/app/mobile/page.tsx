"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Smartphone, 
  Tablet, 
  Watch, 
  Laptop, 
  Monitor,
  Fingerprint,
  Camera,
  Mic,
  Eye,
  Shield,
  Wifi,
  Battery,
  MapPin,
  Settings,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Zap,
  Globe,
  Lock,
  Unlock
} from "lucide-react"

interface MobileDevice {
  id: string
  deviceId: string
  deviceType: 'SMARTPHONE' | 'TABLET' | 'WEARABLE' | 'DESKTOP' | 'LAPTOP'
  platform: string
  version: string
  pushToken: string | null
  isActive: boolean
  lastSeen: string
  location: string | null
  biometricEnabled: boolean
}

interface BiometricAuth {
  id: string
  userId: string
  fingerprintHash: string | null
  faceRecognitionData: string | null
  voicePrintHash: string | null
  irisScanHash: string | null
  isEnabled: boolean
  lastUsed: string | null
}

interface MobileTransaction {
  id: string
  description: string
  amount: number
  type: 'DEBIT' | 'CREDIT'
  date: string
  deviceId: string
  biometricVerified: boolean
  location: string | null
}

export default function MobileAppPage() {
  const [devices, setDevices] = useState<MobileDevice[]>([])
  const [biometricAuth, setBiometricAuth] = useState<BiometricAuth | null>(null)
  const [mobileTransactions, setMobileTransactions] = useState<MobileTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [biometricType, setBiometricType] = useState<string>("")
  const [deviceFilter, setDeviceFilter] = useState("all")

  useEffect(() => {
    fetchMobileData()
  }, [])

  const fetchMobileData = async () => {
    try {
      const [devicesRes, biometricRes, transactionsRes] = await Promise.all([
        fetch("/api/mobile/devices"),
        fetch("/api/mobile/biometric"),
        fetch("/api/mobile/transactions")
      ])

      if (devicesRes.ok) {
        const devicesData = await devicesRes.json()
        setDevices(devicesData)
      }

      if (biometricRes.ok) {
        const biometricData = await biometricRes.json()
        setBiometricAuth(biometricData)
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json()
        setMobileTransactions(transactionsData)
      }
    } catch (error) {
      console.error("Error fetching mobile data:", error)
    } finally {
      setLoading(false)
    }
  }

  const registerDevice = async () => {
    try {
      const response = await fetch("/api/mobile/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceType: "SMARTPHONE",
          platform: "iOS",
          version: "17.0",
          location: "40.7128,-74.0060"
        }),
      })

      if (response.ok) {
        await fetchMobileData()
      }
    } catch (error) {
      console.error("Error registering device:", error)
    }
  }

  const enableBiometric = async (type: string) => {
    setScanning(true)
    try {
      const response = await fetch("/api/mobile/biometric/enable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      })

      if (response.ok) {
        await fetchMobileData()
      }
    } catch (error) {
      console.error("Error enabling biometric:", error)
    } finally {
      setScanning(false)
    }
  }

  const disableBiometric = async () => {
    try {
      const response = await fetch("/api/mobile/biometric/disable", {
        method: "POST",
      })

      if (response.ok) {
        await fetchMobileData()
      }
    } catch (error) {
      console.error("Error disabling biometric:", error)
    }
  }

  const syncDevice = async (deviceId: string) => {
    try {
      const response = await fetch(`/api/mobile/devices/${deviceId}/sync`, {
        method: "POST",
      })

      if (response.ok) {
        await fetchMobileData()
      }
    } catch (error) {
      console.error("Error syncing device:", error)
    }
  }

  const filteredDevices = devices.filter(device => {
    return deviceFilter === "all" || device.deviceType === deviceFilter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'SMARTPHONE':
        return <Smartphone className="h-5 w-5" />
      case 'TABLET':
        return <Tablet className="h-5 w-5" />
      case 'WEARABLE':
        return <Watch className="h-5 w-5" />
      case 'DESKTOP':
        return <Monitor className="h-5 w-5" />
      case 'LAPTOP':
        return <Laptop className="h-5 w-5" />
      default:
        return <Smartphone className="h-5 w-5" />
    }
  }

  const getBiometricIcon = (type: string) => {
    switch (type) {
      case 'fingerprint':
        return <Fingerprint className="h-4 w-4" />
      case 'face':
        return <Camera className="h-4 w-4" />
      case 'voice':
        return <Mic className="h-4 w-4" />
      case 'iris':
        return <Eye className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Loading mobile app...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mobile App</h1>
          <p className="text-gray-600">Native mobile application and device management</p>
        </div>

        {/* Device Registration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Device Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm text-gray-500">Device Type</Label>
                <Select defaultValue="SMARTPHONE">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMARTPHONE">Smartphone</SelectItem>
                    <SelectItem value="TABLET">Tablet</SelectItem>
                    <SelectItem value="WEARABLE">Wearable</SelectItem>
                    <SelectItem value="DESKTOP">Desktop</SelectItem>
                    <SelectItem value="LAPTOP">Laptop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Platform</Label>
                <Select defaultValue="iOS">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iOS">iOS</SelectItem>
                    <SelectItem value="Android">Android</SelectItem>
                    <SelectItem value="Windows">Windows</SelectItem>
                    <SelectItem value="macOS">macOS</SelectItem>
                    <SelectItem value="Linux">Linux</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Version</Label>
                <Input placeholder="17.0" />
              </div>
              <div className="flex items-end">
                <Button onClick={registerDevice}>
                  <Zap className="h-4 w-4 mr-2" />
                  Register Device
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Biometric Authentication */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Biometric Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-4">Available Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Fingerprint className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Fingerprint</div>
                        <div className="text-sm text-gray-500">Touch ID / Fingerprint sensor</div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => enableBiometric('fingerprint')}
                      disabled={scanning}
                    >
                      {scanning && biometricType === 'fingerprint' ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Enable
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Camera className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Face Recognition</div>
                        <div className="text-sm text-gray-500">Face ID / Camera recognition</div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => enableBiometric('face')}
                      disabled={scanning}
                    >
                      {scanning && biometricType === 'face' ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Enable
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mic className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-medium">Voice Recognition</div>
                        <div className="text-sm text-gray-500">Voice print authentication</div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => enableBiometric('voice')}
                      disabled={scanning}
                    >
                      {scanning && biometricType === 'voice' ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Enable
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-orange-600" />
                      <div>
                        <div className="font-medium">Iris Scan</div>
                        <div className="text-sm text-gray-500">Iris recognition technology</div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => enableBiometric('iris')}
                      disabled={scanning}
                    >
                      {scanning && biometricType === 'iris' ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Enable
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Current Status</h4>
                {biometricAuth ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Biometric Enabled</span>
                      <Badge variant={biometricAuth.isEnabled ? "default" : "secondary"}>
                        {biometricAuth.isEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    {biometricAuth.lastUsed && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Last Used</span>
                        <span className="text-sm text-gray-500">
                          {formatDate(biometricAuth.lastUsed)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Methods Configured</span>
                      <div className="flex gap-1">
                        {biometricAuth.fingerprintHash && <Fingerprint className="h-4 w-4 text-blue-600" />}
                        {biometricAuth.faceRecognitionData && <Camera className="h-4 w-4 text-green-600" />}
                        {biometricAuth.voicePrintHash && <Mic className="h-4 w-4 text-purple-600" />}
                        {biometricAuth.irisScanHash && <Eye className="h-4 w-4 text-orange-600" />}
                      </div>
                    </div>
                    {biometricAuth.isEnabled && (
                      <Button variant="outline" onClick={disableBiometric}>
                        <Unlock className="h-4 w-4 mr-2" />
                        Disable Biometric
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No biometric authentication</h3>
                    <p className="text-gray-500">
                      Enable biometric authentication for enhanced security
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{devices.length}</div>
              <p className="text-xs text-muted-foreground">
                {devices.filter(d => d.isActive).length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Biometric Enabled</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {biometricAuth?.isEnabled ? "Yes" : "No"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mobile Transactions</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mobileTransactions.length}</div>
              <p className="text-xs text-muted-foreground">
                {mobileTransactions.filter(t => t.biometricVerified).length} verified
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platforms</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(devices.map(d => d.platform)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Different platforms
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Device Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="w-48">
                <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Devices</SelectItem>
                    <SelectItem value="SMARTPHONE">Smartphones</SelectItem>
                    <SelectItem value="TABLET">Tablets</SelectItem>
                    <SelectItem value="WEARABLE">Wearables</SelectItem>
                    <SelectItem value="DESKTOP">Desktops</SelectItem>
                    <SelectItem value="LAPTOP">Laptops</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Devices Table */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Registered Devices</CardTitle>
            <CardDescription>
              {filteredDevices.length} of {devices.length} devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredDevices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Biometric</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(device.deviceType)}
                          <div>
                            <div className="font-medium">{device.deviceType}</div>
                            <div className="text-sm text-gray-500">{device.deviceId.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{device.platform}</div>
                          <div className="text-sm text-gray-500">v{device.version}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={device.isActive ? "default" : "secondary"}>
                          {device.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {formatDate(device.lastSeen)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {device.location ? (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{device.location}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">Unknown</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={device.biometricEnabled ? "default" : "outline"}>
                          {device.biometricEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => syncDevice(device.id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No devices found</h3>
                <p className="text-gray-500">
                  {devices.length === 0 
                    ? "Register your first device to get started." 
                    : "Try adjusting your filter criteria."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mobile Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Mobile Transactions</CardTitle>
            <CardDescription>Transactions made from mobile devices</CardDescription>
          </CardHeader>
          <CardContent>
            {mobileTransactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Biometric</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mobileTransactions.slice(0, 10).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {formatDate(transaction.date)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'CREDIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{transaction.deviceId.substring(0, 8)}...</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaction.biometricVerified ? (
                          <Badge variant="default">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <XCircle className="h-3 w-3 mr-1" />
                            Not Verified
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {transaction.location ? (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{transaction.location}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">Unknown</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No mobile transactions</h3>
                <p className="text-gray-500">
                  Mobile transactions will appear here when you make transactions from mobile devices.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 