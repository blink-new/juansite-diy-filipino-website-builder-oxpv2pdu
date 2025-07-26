import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { PaymentModal } from './components/PaymentModal'
import { 
  Smartphone, 
  Zap, 
  Globe, 
  Star, 
  ArrowRight, 
  Check,
  Store,
  UtensilsCrossed,
  ShoppingBag,
  Users,
  Clock,
  Heart,
  Crown
} from 'lucide-react'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userSubscription, setUserSubscription] = useState(null)
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, planType: 'pro' as 'starter' | 'growth' | 'pro' | 'biz_elite' })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  // Fetch user subscription when user is loaded
  useEffect(() => {
    const fetchUserSubscription = async () => {
      if (user?.id) {
        try {
          const subscription = await blink.db.users.list({
            where: { id: user.id },
            limit: 1
          })
          if (subscription.length > 0) {
            setUserSubscription(subscription[0])
          }
        } catch (error) {
          console.error('Error fetching subscription:', error)
        }
      }
    }
    
    fetchUserSubscription()
  }, [user])

  const openPaymentModal = (planType: 'starter' | 'growth' | 'pro' | 'biz_elite') => {
    if (!user) {
      blink.auth.login()
      return
    }
    setPaymentModal({ isOpen: true, planType })
  }

  const closePaymentModal = () => {
    setPaymentModal({ isOpen: false, planType: 'pro' })
  }

  const handleGetStarted = () => {
    if (!user) {
      blink.auth.login()
    } else {
      // Navigate to setup wizard (will implement later)
      console.log('Navigate to setup wizard')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">JuanSite</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  {userSubscription?.subscriptionType && userSubscription.subscriptionType !== 'free' && (
                    <Badge className={`${userSubscription.subscriptionType === 'biz_elite' ? 'bg-accent' : 'bg-primary'}`}>
                      <Crown className="w-3 h-3 mr-1" />
                      {userSubscription.subscriptionType === 'biz_elite' ? 'BIZ ELITE' : userSubscription.subscriptionType.toUpperCase()}
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">Hi, {user.email}</span>
                  <Button onClick={() => blink.auth.logout()}>Logout</Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => blink.auth.login()}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              Para sa mga Filipino entrepreneurs! 🇵🇭
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              <span className="text-primary">Gawa mo,</span>{' '}
              <span className="text-accent">site mo!</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Ang pinakamadaling paraan para gumawa ng professional website para sa inyong business. 
              Walang coding, walang hassle - <strong>10 minutes lang!</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
                onClick={handleGetStarted}
              >
                Simulan Ngayon - FREE!
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                Under 10 minutes setup
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Filipino businesses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5 min</div>
                <div className="text-sm text-muted-foreground">Average setup time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">FREE</div>
                <div className="text-sm text-muted-foreground">Forever plan available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Perfect para sa inyong business type
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose from templates na ginawa specifically para sa mga Filipino businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sari-sari Store Template */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Store className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Sari-sari Store</CardTitle>
                <CardDescription>
                  Perfect para sa neighborhood stores at retail businesses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-primary mr-2" />
                    Product catalog with prices
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-primary mr-2" />
                    Store hours & location
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-primary mr-2" />
                    Contact info & GCash details
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Food Business Template */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <UtensilsCrossed className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-xl">Food Business</CardTitle>
                <CardDescription>
                  Para sa mga food sellers, catering, at restaurants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-primary mr-2" />
                    Menu with photos & prices
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-primary mr-2" />
                    Delivery areas & schedule
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-primary mr-2" />
                    Order form integration
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Online Seller Template */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <ShoppingBag className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Online Seller</CardTitle>
                <CardDescription>
                  Para sa mga resellers at online shop owners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-primary mr-2" />
                    Product showcase gallery
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-primary mr-2" />
                    Social media links
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-primary mr-2" />
                    Customer testimonials
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Bakit JuanSite ang best choice?
            </h2>
            <p className="text-lg text-muted-foreground">
              Ginawa namin ito specifically para sa mga Filipino entrepreneurs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile-First</h3>
              <p className="text-muted-foreground">
                Perfect sa phone - kasi alam namin na yan ang ginagamit ng mga customers ninyo
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Super Bilis</h3>
              <p className="text-muted-foreground">
                10 minutes lang, may website ka na! No coding, no design skills needed
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Made for Pinoys</h3>
              <p className="text-muted-foreground">
                Taglish interface, GCash integration, at templates na familiar sa atin
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Sharing</h3>
              <p className="text-muted-foreground">
                One-click share sa Facebook, Viber, at iba pang social media platforms
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Domain</h3>
              <p className="text-muted-foreground">
                Get your free yourname.juansite.ph domain - professional tignan!
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Always Updated</h3>
              <p className="text-muted-foreground">
                Edit anytime, anywhere - real-time updates sa inyong website
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Simple pricing, walang hidden fees
            </h2>
            <p className="text-lg text-muted-foreground">
              Start for free, upgrade lang when ready na kayo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">Free</CardTitle>
                <div className="text-3xl font-bold text-primary">₱0</div>
                <CardDescription className="text-sm">Perfect para sa simula</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 mb-2">Add-ons:</p>
                  <p className="text-xs text-blue-600">+₱99 Custom Domain</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-2">Target:</p>
                  <p className="text-xs text-gray-600">Aspiring online sellers, sari-sari stores, beginners</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-2">Key Features:</p>
                  <p className="text-xs text-gray-600">Basic mobile-ready site with branded subdomain</p>
                </div>
                <Button className="w-full text-sm" variant="outline" onClick={handleGetStarted}>
                  {user && userSubscription?.subscriptionType === 'free' ? 'Current Plan' : 'Start Free'}
                </Button>
              </CardContent>
            </Card>

            {/* Starter Plan */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">Starter</CardTitle>
                <div className="text-3xl font-bold text-primary">₱299</div>
                <CardDescription className="text-sm">per month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 mb-2">Add-ons:</p>
                  <p className="text-xs text-blue-600">+₱99 SMS Alerts</p>
                  <p className="text-xs text-blue-600">+₱199 CRM Lite</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-2">Target:</p>
                  <p className="text-xs text-gray-600">New freelancers, home-based biz, local service providers</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-2">Key Features:</p>
                  <p className="text-xs text-gray-600">DIY web builder, contact form, image gallery</p>
                </div>
                <Button 
                  className="w-full text-sm" 
                  onClick={() => openPaymentModal('starter')}
                  disabled={userSubscription?.subscriptionType === 'starter' || userSubscription?.subscriptionType === 'growth' || userSubscription?.subscriptionType === 'pro' || userSubscription?.subscriptionType === 'biz_elite'}
                >
                  {userSubscription?.subscriptionType === 'starter' ? 'Current Plan' : 'Upgrade to Starter'}
                </Button>
              </CardContent>
            </Card>

            {/* Growth Plan */}
            <Card className="border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white text-xs px-3 py-1">Most Popular</Badge>
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">Growth</CardTitle>
                <div className="text-3xl font-bold text-primary">₱599</div>
                <CardDescription className="text-sm">per month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 mb-2">Add-ons:</p>
                  <p className="text-xs text-blue-600">+₱149 SEO Booster Pack</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-2">Target:</p>
                  <p className="text-xs text-gray-600">Scaling solopreneurs, online resellers, prosumers</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-2">Key Features:</p>
                  <p className="text-xs text-gray-600">Includes blog tools, social media linking, analytics</p>
                </div>
                <Button 
                  className="w-full text-sm" 
                  onClick={() => openPaymentModal('growth')}
                  disabled={userSubscription?.subscriptionType === 'growth' || userSubscription?.subscriptionType === 'pro' || userSubscription?.subscriptionType === 'biz_elite'}
                >
                  {userSubscription?.subscriptionType === 'growth' ? 'Current Plan' : 'Upgrade to Growth'}
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">Pro</CardTitle>
                <div className="text-3xl font-bold text-primary">₱999</div>
                <CardDescription className="text-sm">per month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 mb-2">Add-ons:</p>
                  <p className="text-xs text-blue-600">+₱299 Mini POS Integration</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-2">Target:</p>
                  <p className="text-xs text-gray-600">Serious MSMEs, food stalls, local brands</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-2">Key Features:</p>
                  <p className="text-xs text-gray-600">Full suite + inventory, orders, client lists</p>
                </div>
                <Button 
                  className="w-full text-sm" 
                  onClick={() => openPaymentModal('pro')}
                  disabled={userSubscription?.subscriptionType === 'pro' || userSubscription?.subscriptionType === 'biz_elite'}
                >
                  {userSubscription?.subscriptionType === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
                </Button>
              </CardContent>
            </Card>

            {/* Biz Elite Plan */}
            <Card className="border-2 border-accent">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">Biz Elite</CardTitle>
                <div className="text-3xl font-bold text-accent">₱1,999</div>
                <CardDescription className="text-sm">per month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 mb-2">Add-ons:</p>
                  <p className="text-xs text-blue-600">+₱499 E-Commerce Suite</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-2">Target:</p>
                  <p className="text-xs text-gray-600">Growth-stage brands, small shops going full online</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-2">Key Features:</p>
                  <p className="text-xs text-gray-600">"Business in a box": Pro + Shop + Payment + Reports</p>
                </div>
                <Button 
                  className="w-full text-sm bg-accent hover:bg-accent/90" 
                  onClick={() => openPaymentModal('biz_elite')}
                  disabled={userSubscription?.subscriptionType === 'biz_elite'}
                >
                  {userSubscription?.subscriptionType === 'biz_elite' ? 'Current Plan' : 'Get Biz Elite'}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              All plans include GCash, GrabPay, and PayMaya payment options
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready na ba kayong mag-level up?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Filipino entrepreneurs na nag-trust sa JuanSite para sa kanilang online presence
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100"
            onClick={handleGetStarted}
          >
            Gawa Mo, Site Mo - Start Now!
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-sm mt-4 opacity-75">
            No credit card required • 10-minute setup • Mobile-ready
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">JuanSite</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering Filipino entrepreneurs with professional websites in minutes.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Templates</li>
                <li>Features</li>
                <li>Pricing</li>
                <li>Examples</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Help Center</li>
                <li>Tutorials</li>
                <li>Contact Us</li>
                <li>Community</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Facebook</li>
                <li>Instagram</li>
                <li>TikTok</li>
                <li>YouTube</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 JuanSite. Made with ❤️ for every Filipino entrepreneurs. Powered by Sparkmind Innovations Inc.</p>
          </div>
        </div>
      </footer>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={closePaymentModal}
        planType={paymentModal.planType}
        user={user}
      />
    </div>
  )
}

export default App