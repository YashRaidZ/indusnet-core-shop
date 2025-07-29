import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Settings, 
  Crown, 
  Edit, 
  Eye,
  ToggleLeft,
  ToggleRight,
  Plus,
  Terminal,
  Trash2,
  Save,
  CreditCard,
  DollarSign
} from 'lucide-react';

interface User {
  user_id: string;
  minecraft_username: string;
  display_name: string;
  coins: number;
  rank: string;
  role?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tier: string;
  is_active: boolean;
  is_popular: boolean;
  features: string[];
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  user_id: string;
}

interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: string;
  is_active: boolean;
  features: string[];
  rcon_commands: string[];
}

interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customer_email: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPlan, setEditingPlan] = useState<PaymentPlan | null>(null);
  const [rconCommand, setRconCommand] = useState('');
  const [rconOutput, setRconOutput] = useState('');
  const [rconLoading, setRconLoading] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    tier: '',
    features: '',
    is_active: true,
    is_popular: false
  });
  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    amount: '',
    interval: 'month',
    features: '',
    rcon_commands: '',
    is_active: true
  });
  const { toast } = useToast();

  // Fetch admin data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users with profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, minecraft_username, display_name, coins, rank');

      if (profilesError) throw profilesError;

      // Fetch user roles separately
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles = profilesData?.map(profile => {
        const userRole = rolesData?.find(role => role.user_id === profile.user_id);
        return {
          ...profile,
          role: userRole?.role || 'user'
        };
      }) || [];

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id, total_amount, status, payment_method, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(50);

      if (ordersError) throw ordersError;

      // Fetch payment plans
      const { data: plansData, error: plansError } = await supabase
        .from('payment_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (plansError) throw plansError;

      // Fetch payment transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (transactionsError) throw transactionsError;

      setUsers(usersWithRoles);
      setProducts(productsData || []);
      setOrders(ordersData || []);
      setPaymentPlans(plansData || []);
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update user role
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // First, delete existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Then insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole as 'admin' | 'moderator' | 'user' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  // Toggle product status
  const toggleProductStatus = async (productId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !isActive })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Product ${!isActive ? 'activated' : 'deactivated'} successfully`,
      });
      
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating product status:', error);
      toast({
        title: "Error",
        description: "Failed to update product status",
        variant: "destructive",
      });
    }
  };

  // Create or update product
  const saveProduct = async () => {
    try {
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        category: productForm.category,
        tier: productForm.tier,
        features: productForm.features.split(',').map(f => f.trim()).filter(f => f),
        is_active: productForm.is_active,
        is_popular: productForm.is_popular
      };

      let error;
      if (editingProduct) {
        // Update existing product
        const result = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        error = result.error;
      } else {
        // Create new product
        const result = await supabase
          .from('products')
          .insert(productData);
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Product ${editingProduct ? 'updated' : 'created'} successfully`,
      });
      
      setShowProductDialog(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        tier: '',
        features: '',
        is_active: true,
        is_popular: false
      });
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  // Delete product
  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  // Execute RCON command
  const executeRconCommand = async () => {
    if (!rconCommand.trim()) return;
    
    setRconLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('rcon-command', {
        body: { command: rconCommand }
      });

      if (error) throw error;

      setRconOutput(prev => `${prev}\n> ${rconCommand}\n${data.result || 'Command executed successfully'}`);
      setRconCommand('');
    } catch (error) {
      console.error('Error executing RCON command:', error);
      setRconOutput(prev => `${prev}\n> ${rconCommand}\nError: ${error.message}`);
      toast({
        title: "Error",
        description: "Failed to execute RCON command",
        variant: "destructive",
      });
    } finally {
      setRconLoading(false);
    }
  };

  // Open product dialog for editing
  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      tier: product.tier || '',
      features: product.features?.join(', ') || '',
      is_active: product.is_active,
      is_popular: product.is_popular || false
    });
    setShowProductDialog(true);
  };

  // Create or update payment plan
  const savePlan = async () => {
    try {
      const planData = {
        name: planForm.name,
        description: planForm.description,
        amount: parseFloat(planForm.amount),
        interval: planForm.interval,
        features: planForm.features.split(',').map(f => f.trim()).filter(f => f),
        rcon_commands: planForm.rcon_commands.split(',').map(c => c.trim()).filter(c => c),
        is_active: planForm.is_active
      };

      let error;
      if (editingPlan) {
        const result = await supabase
          .from('payment_plans')
          .update(planData)
          .eq('id', editingPlan.id);
        error = result.error;
      } else {
        const result = await supabase
          .from('payment_plans')
          .insert(planData);
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Payment plan ${editingPlan ? 'updated' : 'created'} successfully`,
      });
      
      setShowPlanDialog(false);
      setEditingPlan(null);
      setPlanForm({
        name: '',
        description: '',
        amount: '',
        interval: 'month',
        features: '',
        rcon_commands: '',
        is_active: true
      });
      fetchData();
    } catch (error) {
      console.error('Error saving payment plan:', error);
      toast({
        title: "Error",
        description: "Failed to save payment plan",
        variant: "destructive",
      });
    }
  };

  // Delete payment plan
  const deletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this payment plan?')) return;
    
    try {
      const { error } = await supabase
        .from('payment_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment plan deleted successfully",
      });
      
      fetchData();
    } catch (error) {
      console.error('Error deleting payment plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete payment plan",
        variant: "destructive",
      });
    }
  };

  // Toggle payment plan status
  const togglePlanStatus = async (planId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('payment_plans')
        .update({ is_active: !isActive })
        .eq('id', planId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Payment plan ${!isActive ? 'activated' : 'deactivated'} successfully`,
      });
      
      fetchData();
    } catch (error) {
      console.error('Error updating payment plan status:', error);
      toast({
        title: "Error",
        description: "Failed to update payment plan status",
        variant: "destructive",
      });
    }
  };

  // Open plan dialog for editing
  const openEditPlan = (plan: PaymentPlan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      description: plan.description || '',
      amount: plan.amount.toString(),
      interval: plan.interval,
      features: plan.features?.join(', ') || '',
      rcon_commands: plan.rcon_commands?.join(', ') || '',
      is_active: plan.is_active
    });
    setShowPlanDialog(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, products, and orders</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Users className="h-10 w-10 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Package className="h-10 w-10 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Products</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <ShoppingCart className="h-10 w-10 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Crown className="h-10 w-10 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">
                    ${orders.reduce((sum, order) => sum + Number(order.total_amount), 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="payments">
              <CreditCard className="w-4 h-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <DollarSign className="w-4 h-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="rcon">
              <Terminal className="w-4 h-4 mr-2" />
              RCON
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Minecraft Username</TableHead>
                      <TableHead>Coins</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.user_id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.display_name || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">{user.user_id.substring(0, 8)}...</p>
                          </div>
                        </TableCell>
                        <TableCell>{user.minecraft_username || 'N/A'}</TableCell>
                        <TableCell>{user.coins || 0}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{user.rank || 'Member'}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            user.role === 'admin' ? 'destructive' :
                            user.role === 'moderator' ? 'default' : 'secondary'
                          }>
                            {user.role || 'user'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select 
                            defaultValue={user.role || 'user'}
                            onValueChange={(value) => updateUserRole(user.user_id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Management */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>Manage store products and pricing</CardDescription>
                </div>
                <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        name: '',
                        description: '',
                        price: '',
                        category: '',
                        tier: '',
                        features: '',
                        is_active: true,
                        is_popular: false
                      });
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                      <DialogDescription>
                        {editingProduct ? 'Update product details' : 'Create a new product for the store'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          value={productForm.name}
                          onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={productForm.description}
                          onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Enter product description"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="price">Price ($)</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={productForm.price}
                            onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select value={productForm.category} onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ranks">Ranks</SelectItem>
                              <SelectItem value="kits">Kits</SelectItem>
                              <SelectItem value="cosmetics">Cosmetics</SelectItem>
                              <SelectItem value="perks">Perks</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="tier">Tier</Label>
                        <Input
                          id="tier"
                          value={productForm.tier}
                          onChange={(e) => setProductForm(prev => ({ ...prev, tier: e.target.value }))}
                          placeholder="e.g., VIP, Elite, Premium"
                        />
                      </div>
                      <div>
                        <Label htmlFor="features">Features (comma-separated)</Label>
                        <Textarea
                          id="features"
                          value={productForm.features}
                          onChange={(e) => setProductForm(prev => ({ ...prev, features: e.target.value }))}
                          placeholder="Feature 1, Feature 2, Feature 3"
                        />
                      </div>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={productForm.is_active}
                            onChange={(e) => setProductForm(prev => ({ ...prev, is_active: e.target.checked }))}
                          />
                          <span>Active</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={productForm.is_popular}
                            onChange={(e) => setProductForm(prev => ({ ...prev, is_popular: e.target.checked }))}
                          />
                          <span>Popular</span>
                        </label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowProductDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={saveProduct}>
                        <Save className="w-4 h-4 mr-2" />
                        {editingProduct ? 'Update' : 'Create'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Popular</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.is_active ? 'default' : 'secondary'}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {product.is_popular ? (
                            <Badge variant="destructive">Popular</Badge>
                          ) : (
                            <span className="text-muted-foreground">No</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleProductStatus(product.id, product.is_active)}
                            >
                              {product.is_active ? (
                                <ToggleRight className="w-4 h-4" />
                              ) : (
                                <ToggleLeft className="w-4 h-4" />
                              )}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => openEditProduct(product)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteProduct(product.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Management */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          {order.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {order.user_id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>${order.total_amount}</TableCell>
                        <TableCell>
                          <Badge variant={
                            order.status === 'completed' ? 'default' :
                            order.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Plans Management */}
          <TabsContent value="payments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Payment Plans Management</CardTitle>
                  <CardDescription>Manage subscription plans and one-time payments</CardDescription>
                </div>
                <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingPlan(null);
                      setPlanForm({
                        name: '',
                        description: '',
                        amount: '',
                        interval: 'month',
                        features: '',
                        rcon_commands: '',
                        is_active: true
                      });
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Payment Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingPlan ? 'Edit Payment Plan' : 'Add New Payment Plan'}</DialogTitle>
                      <DialogDescription>
                        {editingPlan ? 'Update payment plan details' : 'Create a new payment plan'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="plan-name">Plan Name</Label>
                        <Input
                          id="plan-name"
                          value={planForm.name}
                          onChange={(e) => setPlanForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter plan name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="plan-description">Description</Label>
                        <Textarea
                          id="plan-description"
                          value={planForm.description}
                          onChange={(e) => setPlanForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Enter plan description"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="plan-amount">Amount ($)</Label>
                          <Input
                            id="plan-amount"
                            type="number"
                            step="0.01"
                            value={planForm.amount}
                            onChange={(e) => setPlanForm(prev => ({ ...prev, amount: e.target.value }))}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label htmlFor="plan-interval">Billing Interval</Label>
                          <Select value={planForm.interval} onValueChange={(value) => setPlanForm(prev => ({ ...prev, interval: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select interval" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="month">Monthly</SelectItem>
                              <SelectItem value="year">Yearly</SelectItem>
                              <SelectItem value="one_time">One Time</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="plan-features">Features (comma-separated)</Label>
                        <Textarea
                          id="plan-features"
                          value={planForm.features}
                          onChange={(e) => setPlanForm(prev => ({ ...prev, features: e.target.value }))}
                          placeholder="Feature 1, Feature 2, Feature 3"
                        />
                      </div>
                      <div>
                        <Label htmlFor="plan-rcon">RCON Commands (comma-separated)</Label>
                        <Textarea
                          id="plan-rcon"
                          value={planForm.rcon_commands}
                          onChange={(e) => setPlanForm(prev => ({ ...prev, rcon_commands: e.target.value }))}
                          placeholder="lp user {username} parent set vip, kit vip {username}"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={planForm.is_active}
                          onChange={(e) => setPlanForm(prev => ({ ...prev, is_active: e.target.checked }))}
                        />
                        <span>Active</span>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowPlanDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={savePlan}>
                        <Save className="w-4 h-4 mr-2" />
                        {editingPlan ? 'Update' : 'Create'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Interval</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Features</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{plan.name}</p>
                            <p className="text-sm text-muted-foreground">{plan.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>${plan.amount}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{plan.interval}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                            {plan.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {plan.features?.slice(0, 2).map((feature, i) => (
                              <div key={i}>{feature}</div>
                            ))}
                            {plan.features?.length > 2 && (
                              <div className="text-muted-foreground">+{plan.features.length - 2} more</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => togglePlanStatus(plan.id, plan.is_active)}
                            >
                              {plan.is_active ? (
                                <ToggleRight className="w-4 h-4" />
                              ) : (
                                <ToggleLeft className="w-4 h-4" />
                              )}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => openEditPlan(plan)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deletePlan(plan.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Management */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Payment Transactions</CardTitle>
                <CardDescription>View and monitor all payment transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-mono text-sm">
                          {transaction.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>{transaction.customer_email}</TableCell>
                        <TableCell>${transaction.amount} {transaction.currency.toUpperCase()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            transaction.status === 'completed' ? 'default' :
                            transaction.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RCON Management */}
          <TabsContent value="rcon">
            <Card>
              <CardHeader>
                <CardTitle>RCON Console</CardTitle>
                <CardDescription>Execute Minecraft server commands remotely</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="rcon-output">Console Output</Label>
                  <Textarea
                    id="rcon-output"
                    value={rconOutput}
                    readOnly
                    className="min-h-[300px] font-mono text-sm bg-black text-green-400 border-0"
                    placeholder="RCON output will appear here..."
                  />
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Label htmlFor="rcon-command">Command</Label>
                    <Input
                      id="rcon-command"
                      value={rconCommand}
                      onChange={(e) => setRconCommand(e.target.value)}
                      placeholder="Enter RCON command (e.g., list, say Hello World)"
                      onKeyPress={(e) => e.key === 'Enter' && executeRconCommand()}
                      className="font-mono"
                    />
                  </div>
                  <Button 
                    onClick={executeRconCommand} 
                    disabled={rconLoading || !rconCommand.trim()}
                    className="mt-6"
                  >
                    <Terminal className="w-4 h-4 mr-2" />
                    Execute
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRconCommand('list')}
                  >
                    List Players
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRconCommand('tps')}
                  >
                    Check TPS
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRconCommand('save-all')}
                  >
                    Save World
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRconOutput('')}
                  >
                    Clear Output
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Warning:</strong> Use RCON commands carefully. Some commands can affect server performance or player experience.</p>
                  <p><strong>Common commands:</strong> list, tps, save-all, whitelist, ban, kick, say, give</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system-wide settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Server Management</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Manage Minecraft server settings and RCON
                      </p>
                      <Button variant="outline" className="w-full">
                        Configure RCON
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Payment Settings</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Configure payment gateways and pricing
                      </p>
                      <Button variant="outline" className="w-full">
                        Payment Config
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;