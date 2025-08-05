"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import WorkOrderForm from "@/components/work-order-form"

export default function SubmitWorkOrderPage() {
  const [showWorkOrderForm, setShowWorkOrderForm] = useState(true)
  const router = useRouter()

  const handleWorkOrderSubmit = (workOrderData) => {
    console.log("Work Order Submitted:", workOrderData)
    toast.success("Work order submitted successfully!")
    
    // Redirect back to technician dashboard
    router.push("/dashboard/technician")
  }

  const handleClose = () => {
    router.push("/dashboard/technician")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Submit Work Order</CardTitle>
            <CardDescription>
              Report a maintenance issue or request service for equipment at your location.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WorkOrderForm
              isOpen={showWorkOrderForm}
              onClose={handleClose}
              onSubmit={handleWorkOrderSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 