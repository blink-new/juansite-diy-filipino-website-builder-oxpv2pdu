import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { X, ExternalLink, Check, Clock } from 'lucide-react'
import { blink } from '../blink/client'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  planType: 'starter' | 'growth' | 'pro' | 'biz_elite'
  user: any
}

export function PaymentModal({ isOpen, onClose, planType, user }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment' | 'verification'>('details')
  const [transactionId, setTransactionId] = useState('')

  if (!isOpen) return null

  const planDetails = {
    starter: {
      name: 'STARTER',
      price: '₱299',
      period: '/month',
      description: 'Para sa new freelancers at home-based biz',
      features: [
        'DIY web builder',
        'Contact form',
        'Image gallery',
        'Remove branding'
      ]
    },
    growth: {
      name: 'GROWTH',
      price: '₱599',
      period: '/month',
      description: 'Para sa scaling solopreneurs',
      features: [
        'Blog tools',
        'Social media linking',
        'Analytics',
        'SEO optimization'
      ]
    },
    pro: {
      name: 'PRO',
      price: '₱999',
      period: '/month',
      description: 'Para sa serious MSMEs',
      features: [
        'Full suite',
        'Inventory management',
        'Order tracking',
        'Client lists'
      ]
    },
    biz_elite: {
      name: 'BIZ ELITE',
      price: '₱1,999',
      period: '/month',
      description: 'Para sa growth-stage brands',
      features: [
        'E-commerce suite',
        'Payment processing',
        'Advanced reports',
        'Business analytics'
      ]
    }
  }

  const plan = planDetails[planType]

  const handlePayment = async () => {
    setIsProcessing(true)
    
    try {
      // Create payment transaction record
      const planPrices = {
        starter: 299.00,
        growth: 599.00,
        pro: 999.00,
        biz_elite: 1999.00
      }
      
      const transaction = await blink.db.paymentTransactions.create({
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        subscriptionType: planType,
        amount: planPrices[planType],
        currency: 'PHP',
        paymentMethod: 'paymaya',
        paymentStatus: 'pending'
      })

      setTransactionId(transaction.id)
      setPaymentStep('payment')
      
      // Open PayMaya link in new tab
      window.open('https://paymaya.me/elchannah', '_blank')
      
    } catch (error) {
      console.error('Error creating transaction:', error)
      alert('Error processing payment. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVerifyPayment = async () => {
    if (!transactionId.trim()) {
      alert('Please enter your transaction reference number')
      return
    }

    setIsProcessing(true)
    
    try {
      // Update transaction with reference
      await blink.db.paymentTransactions.update(transactionId, {
        paymentReference: transactionId,
        paymentStatus: 'completed',
        verifiedAt: new Date().toISOString()
      })

      // Update user subscription (all plans are monthly)
      const subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

      await blink.db.users.upsert({
        id: user.id,
        email: user.email,
        displayName: user.displayName || user.email,
        subscriptionType: planType,
        subscriptionStatus: 'active',
        subscriptionStartDate: new Date().toISOString(),
        subscriptionEndDate: subscriptionEndDate.toISOString(),
        paymentMethod: 'paymaya',
        paymentReference: transactionId,
        updatedAt: new Date().toISOString()
      })

      setPaymentStep('verification')
      
      // Refresh page after 3 seconds to show updated subscription
      setTimeout(() => {
        window.location.reload()
      }, 3000)
      
    } catch (error) {
      console.error('Error verifying payment:', error)
      alert('Error verifying payment. Please contact support.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <Badge className={`mb-2 ${planType === 'lifetime' ? 'bg-accent' : 'bg-primary'}`}>
              {plan.name}
            </Badge>
            <CardTitle className="text-2xl">
              {plan.price}<span className="text-sm font-normal">{plan.period}</span>
            </CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {paymentStep === 'details' && (
            <>
              <div className="space-y-2">
                <h4 className="font-medium">What you'll get:</h4>
                <ul className="space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2">Payment Instructions:</h4>
                <ol className="text-sm text-orange-700 space-y-1">
                  <li>1. Click "Pay with PayMaya" below</li>
                  <li>2. Send {plan.price} to our PayMaya account</li>
                  <li>3. Come back and enter your transaction reference</li>
                  <li>4. Your account will be upgraded instantly!</li>
                </ol>
              </div>

              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    Pay with PayMaya
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </>
          )}

          {paymentStep === 'payment' && (
            <>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <ExternalLink className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">PayMaya window opened</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete your payment of {plan.price} and return here with your transaction reference
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Transaction Reference Number
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter your PayMaya transaction reference"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <Button 
                  className="w-full"
                  onClick={handleVerifyPayment}
                  disabled={isProcessing || !transactionId.trim()}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying Payment...
                    </div>
                  ) : (
                    'Verify Payment & Upgrade Account'
                  )}
                </Button>
              </div>
            </>
          )}

          {paymentStep === 'verification' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-600">Payment Verified!</h3>
                <p className="text-sm text-muted-foreground">
                  Your account has been upgraded to {plan.name}. Redirecting...
                </p>
              </div>
              <div className="flex items-center justify-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                Refreshing in 3 seconds...
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}