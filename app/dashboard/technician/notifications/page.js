"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bell, CheckCircle, AlertTriangle, Clock, Wrench } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock notifications data (replace with API call)
    setNotifications([
      {
        id: 1,
        type: "work_order_assigned",
        message: "New work order WO-004 assigned to you",
        timestamp: "2024-01-12T10:30:00Z",
        read: false,
        priority: "high"
      },
      {
        id: 2,
        type: "work_order_updated",
        message: "Work order WO-001 status updated to In Progress",
        timestamp: "2024-01-12T09:15:00Z",
        read: true,
        priority: "medium"
      },
      {
        id: 3,
        type: "maintenance_due",
        message: "Scheduled maintenance due for Pump #2 tomorrow",
        timestamp: "2024-01-12T08:45:00Z",
        read: false,
        priority: "high"
      },
      {
        id: 4,
        type: "system_alert",
        message: "System maintenance scheduled for tonight at 2 AM",
        timestamp: "2024-01-12T07:30:00Z",
        read: true,
        priority: "low"
      },
      {
        id: 5,
        type: "work_order_completed",
        message: "Work order WO-003 has been marked as completed",
        timestamp: "2024-01-12T06:20:00Z",
        read: true,
        priority: "medium"
      }
    ])
    setLoading(false)
  }, [])

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "work_order_assigned":
        return <Wrench className="h-4 w-4 text-blue-500" />
      case "work_order_updated":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "work_order_completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "maintenance_due":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "system_alert":
        return <Bell className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/dashboard/technician")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your work orders and system alerts</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            All Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} unread</Badge>
            )}
          </CardTitle>
          <CardDescription>
            {notifications.length} total notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications yet</p>
                <p className="text-sm text-muted-foreground">You'll see updates here when they arrive</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`flex items-start gap-3 p-4 border rounded-lg transition-colors ${
                    !notification.read 
                      ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(notification.priority)}`}
                        >
                          {notification.priority}
                        </Badge>
                        {!notification.read && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                    </div>
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2 h-6 px-2 text-xs"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Types Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Types</CardTitle>
          <CardDescription>Understanding different notification types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Work Order Assigned</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Work Order Updated</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Work Order Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm">Maintenance Due</span>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-purple-500" />
              <span className="text-sm">System Alert</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 