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
  Wifi, 
  Camera, 
  Printer, 
  Scan, 
  Monitor,
  Watch,
  Smartphone,
  Settings,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Zap,
  Battery,
  Thermometer,
  Droplets,
  MapPin,
  Signal,
  Power,
  Activity,
  Gauge
} from "lucide-react"

interface IoTDevice {
  id: string
  deviceId: string
  name: string
  type: 'SENSOR' | 'CAMERA' | 'PRINTER' | 'SCANNER' | 'TERMINAL' | 'WEARABLE' | 'SMART_DEVICE' | 'OTHER'
  manufacturer: string
  model: string
  firmware: string
  isActive: boolean
  lastSeen: string
  location: string | null
  batteryLevel: number | null
  temperature: number | null
  humidity: number | null
}

interface IoTTransaction {
  id: string
  description: string
  amount: number
  type: 'DEBIT' | 'CREDIT'
  date: string
  deviceId: string
  deviceType: string
  location: string | null
  sensorData: string | null
}

export default function IoTDevicesPage() {
  const [devices, setDevices] = useState<IoTDevice[]>([])
  const [transactions, setTransactions] = useState<IoTTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [selectedType, setSelectedType] = useState("SENSOR")
  const [deviceFilter, setDeviceFilter] = useState("all")

  useEffect(() => {
    fetchIoTData()
  }, [])

  const fetchIoTData = async () => {
    try {
      const [devicesRes, transactionsRes] = await Promise.all([
        fetch("/api/iot/devices"),
        fetch("/api/iot/transactions")
      ])

      if (devicesRes.ok) {
        const devicesData = await devicesRes.json()
        setDevices(devicesData)
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json()
        setTransactions(transactionsData)
      }
    } catch (error) {
      console.error("Error fetching IoT data:", error)
    } finally {
      setLoading(false)
    }
  }

  const registerDevice = async () => {
    setRegistering(true)
    try {
      const response = await fetch("/api/iot/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Smart Sensor",
          type: selectedType,
          manufacturer: "IoT Corp",
          model: "Sensor-2024",
          firmware: "v2.1.0",
          location: "40.7128,-74.0060"
        }),
      })

      if (response.ok) {
        await fetchIoTData()
      }
    } catch (error) {
      console.error("Error registering device:", error)
    } finally {
      setRegistering(false)
    }
  }

  const toggleDevice = async (deviceId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/iot/devices/${deviceId}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      })

      if (response.ok) {
        await fetchIoTData()
      }
    } catch (error) {
      console.error("Error toggling device:", error)
    }
  }

  const syncDevice = async (deviceId: string) => {
    try {
      const response = await fetch(`/api/iot/devices/${deviceId}/sync`, {
        method: "POST",
      })

      if (response.ok) {
        await fetchIoTData()
      }
    } catch (error) {
      console.error("Error syncing device:", error)
    }
  }

  const filteredDevices = devices.filter(device => {
    return deviceFilter === "all" || device.type === deviceFilter
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
      case 'SENSOR':
        return <Activity className="h-5 w-5 text-blue-600" />
      case 'CAMERA':
        return <Camera className="h-5 w-5 text-green-600" />
      case 'PRINTER':
        return <Printer className="h-5 w-5 text-purple-600" />
      case 'SCANNER':
        return <Scan className="h-5 w-5 text-orange-600" />
      case 'TERMINAL':
        return <Monitor className="h-5 w-5 text-red-600" />
      case 'WEARABLE':
        return <Watch className="h-5 w-5 text-pink-600" />
      case 'SMART_DEVICE':
        return <Smartphone className="h-5 w-5 text-indigo-600" />
      default:
        return <Wifi className="h-5 w-5" />
    }
  }

  const getBatteryIcon = (level: number) => {
    if (level >= 80) return <Battery className="h-4 w-4 text-green-600" />
    if (level >= 50) return <Battery className="h-4 w-4 text-yellow-600" />
    if (level >= 20) return <Battery className="h-4 w-4 text-orange-600" />
    return <Battery className="h-4 w-4 text-red-600" />
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="secondary">
        <XCircle className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Loading IoT devices...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">IoT Device Management</h1>
          <p className="text-gray-600">Connected devices, sensors, and smart automation</p>
        </div>

        {/* Device Registration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              Device Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm text-gray-500">Device Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SENSOR">Sensor</SelectItem>
                    <SelectItem value="CAMERA">Camera</SelectItem>
                    <SelectItem value="PRINTER">Printer</SelectItem>
                    <SelectItem value="SCANNER">Scanner</SelectItem>
                    <SelectItem value="TERMINAL">Terminal</SelectItem>
                    <SelectItem value="WEARABLE">Wearable</SelectItem>
                    <SelectItem value="SMART_DEVICE">Smart Device</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Manufacturer</Label>
                <Input placeholder="IoT Corp" />
              </div>
              <div>
                <Label className="text-sm text-gray-500">Model</Label>
                <Input placeholder="Device-2024" />
              </div>
              <div className="flex items-end">
                <Button onClick={registerDevice} disabled={registering}>
                  {registering ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Register Device
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">IoT Transactions</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{transactions.length}</div>
              <p className="text-xs text-muted-foreground">
                Automated transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {devices.filter(d => d.temperature).length > 0
                  ? Math.round(devices.filter(d => d.temperature).reduce((sum, d) => sum + (d.temperature || 0), 0) / devices.filter(d => d.temperature).length)
                  : 0}°C
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Humidity</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {devices.filter(d => d.humidity).length > 0
                  ? Math.round(devices.filter(d => d.humidity).reduce((sum, d) => sum + (d.humidity || 0), 0) / devices.filter(d => d.humidity).length)
                  : 0}%
              </div>
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
                    <SelectItem value="SENSOR">Sensors</SelectItem>
                    <SelectItem value="CAMERA">Cameras</SelectItem>
                    <SelectItem value="PRINTER">Printers</SelectItem>
                    <SelectItem value="SCANNER">Scanners</SelectItem>
                    <SelectItem value="TERMINAL">Terminals</SelectItem>
                    <SelectItem value="WEARABLE">Wearables</SelectItem>
                    <SelectItem value="SMART_DEVICE">Smart Devices</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Devices Grid */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connected Devices</CardTitle>
            <CardDescription>
              {filteredDevices.length} of {devices.length} devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredDevices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDevices.map((device) => (
                  <div key={device.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getDeviceIcon(device.type)}
                        <div>
                          <div className="font-medium">{device.name}</div>
                          <div className="text-sm text-gray-500">{device.type}</div>
                        </div>
                      </div>
                      {getStatusBadge(device.isActive)}
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Manufacturer:</span>
                        <span className="text-gray-500">{device.manufacturer}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Model:</span>
                        <span className="text-gray-500">{device.model}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Firmware:</span>
                        <span className="text-gray-500">{device.firmware}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Last Seen:</span>
                        <span className="text-gray-500">{formatDate(device.lastSeen)}</span>
                      </div>
                      {device.location && (
                        <div className="flex justify-between text-sm">
                          <span>Location:</span>
                          <span className="text-gray-500">{device.location}</span>
                        </div>
                      )}
                      {device.batteryLevel !== null && (
                        <div className="flex justify-between text-sm">
                          <span>Battery:</span>
                          <div className="flex items-center gap-1">
                            {getBatteryIcon(device.batteryLevel)}
                            <span className="text-gray-500">{device.batteryLevel}%</span>
                          </div>
                        </div>
                      )}
                      {device.temperature !== null && (
                        <div className="flex justify-between text-sm">
                          <span>Temperature:</span>
                          <div className="flex items-center gap-1">
                            <Thermometer className="h-3 w-3 text-orange-600" />
                            <span className="text-gray-500">{device.temperature}°C</span>
                          </div>
                        </div>
                      )}
                      {device.humidity !== null && (
                        <div className="flex justify-between text-sm">
                          <span>Humidity:</span>
                          <div className="flex items-center gap-1">
                            <Droplets className="h-3 w-3 text-blue-600" />
                            <span className="text-gray-500">{device.humidity}%</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleDevice(device.id, !device.isActive)}
                      >
                        {device.isActive ? (
                          <>
                            <Power className="h-4 w-4 mr-1" />
                            Disable
                          </>
                        ) : (
                          <>
                            <Power className="h-4 w-4 mr-1" />
                            Enable
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => syncDevice(device.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Sync
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Wifi className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No devices found</h3>
                <p className="text-gray-500">
                  {devices.length === 0 
                    ? "Register your first IoT device to get started." 
                    : "Try adjusting your filter criteria."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* IoT Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>IoT Transactions</CardTitle>
            <CardDescription>Transactions triggered by IoT devices</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 10).map((transaction) => (
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
                          {getDeviceIcon(transaction.deviceType)}
                          <span className="text-sm">{transaction.deviceId.substring(0, 8)}...</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {transaction.deviceType}
                        </Badge>
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No IoT transactions</h3>
                <p className="text-gray-500">
                  IoT transactions will appear here when devices trigger automated actions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 