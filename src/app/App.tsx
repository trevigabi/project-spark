import { useState } from "react";
import { Toaster } from "./components/ui/sonner";
import { LoginPage } from "./components/LoginPage";
import { Sidebar, TopBar } from "./components/Sidebar";
import type { View } from "./components/Sidebar";
import { clients as clientsList, type Client } from "./data/mockData";
import { DashboardAdmin } from "./components/DashboardAdmin";
import { DashboardRep } from "./components/DashboardRep";
import { DashboardLojista } from "./components/DashboardLojista";
import { CatalogPage } from "./components/CatalogPage";
import { OrderGrade } from "./components/OrderGrade";
import { CartPage } from "./components/CartPage";
import { CartsListPage, mockCarts, type CartContext } from "./components/CartsListPage";
import { OrderHistory } from "./components/OrderHistory";
import { LojistaHistoryDashboard } from "./components/LojistaHistoryDashboard";
import { MarketingStudio } from "./components/MarketingStudio";
import { SelloutDashboard } from "./components/SelloutDashboard";
import { AdminPage } from "./components/AdminPage";
import { ClientsPage } from "./components/ClientsPage";
import { ProfilePage } from "./components/ProfilePage";
import { LojistaFiltersSidebar, defaultFilters, type CatalogFilters } from "./components/LojistaFiltersSidebar";

type Profile = 'admin' | 'rep' | 'lojista';

const viewTitles: Record<View, { title: string; subtitle?: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Visão geral do seu negócio' },
  catalog: { title: 'Catálogo' },
  'order-grade': { title: 'Pedido por Grade', subtitle: 'Monte pedidos em menos de 2 minutos' },
  cart: { title: 'Carrinho', subtitle: 'Revise e finalize seu pedido' },
  carts: { title: 'Carrinhos', subtitle: 'Selecione um carrinho ou crie um novo' },
  history: { title: 'Histórico de Pedidos', subtitle: 'Todos os seus pedidos' },
  marketing: { title: 'Estúdio de Marketing IA', subtitle: 'Crie campanhas profissionais automaticamente' },
  sellout: { title: 'Sell-out Intelligence', subtitle: 'Análise de performance comercial' },
  admin: { title: 'Gestão', subtitle: 'Usuários, produtos, políticas e configurações' },
  clients: { title: 'Clientes', subtitle: 'Sua carteira de clientes' },
  profile: { title: 'Meu Perfil', subtitle: 'Seus dados, preferências e acesso' },
};

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [profile, setProfile] = useState<Profile>('admin');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeCart, setActiveCart] = useState<CartContext | null>(null);
  const [carts, setCarts] = useState<CartContext[]>(() =>
    mockCarts.map(({ id, clientId, clientName, cartName }) => ({ id, clientId, clientName, cartName }))
  );
  const [catalogFilters, setCatalogFilters] = useState<CatalogFilters>(defaultFilters);

  const multiCart = profile === 'admin' || profile === 'rep';
  const clientCarts = selectedClient ? carts.filter(c => c.clientId === selectedClient.id) : [];

  const createCart = (name: string, client?: Client | null): CartContext | null => {
    const c = client ?? selectedClient;
    if (!c) return null;
    const ctx: CartContext = {
      id: `CART-NEW-${Date.now()}`,
      clientId: c.id,
      clientName: c.name,
      cartName: name?.trim() || 'Novo carrinho',
    };
    setCarts(prev => [ctx, ...prev]);
    return ctx;
  };

  const handleLogin = (selectedProfile: Profile) => {
    setProfile(selectedProfile);
    setAuthenticated(true);
    // Lojista entra direto no catálogo; Rep entra direto na lista de clientes
    if (selectedProfile === 'lojista') setCurrentView('catalog');
    else if (selectedProfile === 'rep') setCurrentView('clients');
    else setCurrentView('dashboard');
    setSelectedClient(null);
    setCatalogFilters(defaultFilters);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setCurrentView('dashboard');
    setSelectedClient(null);
  };

  const navigate = (view: View) => setCurrentView(view);

  const viewInfo = currentView === 'dashboard' && (profile === 'rep' || profile === 'admin')
    ? { title: 'Indicadores', subtitle: profile === 'admin' ? 'Visão geral da indústria' : 'Sua performance e carteira' }
    : viewTitles[currentView];

  if (!authenticated) {
    return (
      <div>
        {/* MARKER-MAKE-KIT-INVOKED */}
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        if (profile === 'admin') return <DashboardAdmin onNavigate={navigate} />;
        if (profile === 'rep') return <DashboardRep onNavigate={navigate} selectedClient={selectedClient} />;
        return <DashboardLojista onNavigate={navigate} />;
      case 'catalog': {
        const useFilters = profile === 'lojista' || profile === 'rep';
        return (
          <CatalogPage
            onNavigate={navigate}
            selectedClient={selectedClient}
            externalFilters={useFilters ? catalogFilters : undefined}
            onExternalFiltersChange={useFilters ? setCatalogFilters : undefined}
            clientCarts={multiCart ? (selectedClient ? clientCarts : carts) : undefined}
            activeCartId={activeCart?.id ?? null}
            onPickCart={(ctx) => {
              if (!selectedClient || selectedClient.id !== ctx.clientId) {
                const c = clientsList.find(x => x.id === ctx.clientId) ?? null;
                if (c) setSelectedClient(c);
              }
              setActiveCart(ctx);
            }}
            onCreateCart={(name) => {
              const ctx = createCart(name);
              if (ctx) setActiveCart(ctx);
              return ctx;
            }}
          />
        );
      }
      case 'order-grade':
        return <OrderGrade onNavigate={navigate} selectedClient={selectedClient} />;
      case 'cart':
        return (
          <CartPage
            onNavigate={navigate}
            cartContext={activeCart}
            multiCart={multiCart}
            onCreateNewCart={(name) => {
              const ctx = createCart(name);
              if (ctx) {
                setActiveCart(ctx);
                setCurrentView('catalog');
              }
            }}
          />
        );
      case 'carts':
        return (
          <CartsListPage
            selectedClient={selectedClient}
            onNavigateClients={() => setCurrentView('clients')}
            onSelectClient={(c) => setSelectedClient(c)}
            onOpenCart={(ctx) => {
              if (!selectedClient || selectedClient.id !== ctx.clientId) {
                const c = clientsList.find(x => x.id === ctx.clientId) ?? null;
                if (c) setSelectedClient(c);
              }
              setActiveCart(ctx);
              setCurrentView('cart');
            }}
            onCreateCart={(ctx) => {
              setCarts(prev => [ctx, ...prev]);
              if (!selectedClient || selectedClient.id !== ctx.clientId) {
                const c = clientsList.find(x => x.id === ctx.clientId) ?? null;
                if (c) setSelectedClient(c);
              }
              setActiveCart(ctx);
              setCurrentView('catalog');
            }}
            onGoToCatalog={(ctx) => {
              if (!selectedClient || selectedClient.id !== ctx.clientId) {
                const c = clientsList.find(x => x.id === ctx.clientId) ?? null;
                if (c) setSelectedClient(c);
              }
              setActiveCart(ctx);
              setCurrentView('catalog');
            }}
          />
        );
      case 'history':
        return <OrderHistory onNavigate={navigate} profile={profile} />;
      case 'marketing':
        return <MarketingStudio />;
      case 'sellout':
        return <SelloutDashboard />;
      case 'admin':
        return <AdminPage />;
      case 'clients':
        return <ClientsPage onNavigate={navigate} selectedClient={selectedClient} setSelectedClient={setSelectedClient} />;
      case 'profile':
        return <ProfilePage profile={profile} />;
      default:
        return <DashboardAdmin onNavigate={navigate} />;
    }
  };

  const isFiltersCatalog = (profile === 'lojista' || profile === 'rep') && currentView === 'catalog';
  const noSidebarViews: View[] = ['dashboard', 'clients', 'history', 'marketing', 'cart', 'carts', 'profile', 'admin'];
  const isRepClients = profile === 'rep' && currentView === 'clients';
  const isRepDashboard = profile === 'rep' && currentView === 'dashboard';
  const isRepHistory = profile === 'rep' && currentView === 'history';
  const isRepMarketing = profile === 'rep' && currentView === 'marketing';
  const isRepCart = profile === 'rep' && currentView === 'cart';
  const isAdminNoSidebar = profile === 'admin' && noSidebarViews.includes(currentView);
  const isLojistCart = profile === 'lojista' && currentView === 'cart';
  const isLojistHistory = profile === 'lojista' && currentView === 'history';
  const isProfile = currentView === 'profile';
  const hideSidebar = isRepClients || isRepDashboard || isRepHistory || isRepMarketing || isRepCart || isAdminNoSidebar || isLojistCart || isLojistHistory || isProfile;

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      <Toaster position="top-center" duration={4000} />
      {isFiltersCatalog ? (
        <LojistaFiltersSidebar
          filters={catalogFilters}
          onChange={setCatalogFilters}
          onLogout={handleLogout}
          profile={profile as 'lojista' | 'rep'}
          selectedClient={selectedClient}
        />
      ) : hideSidebar ? null : (
        <Sidebar
          currentView={currentView}
          onNavigate={navigate}
          profile={profile}
          onLogout={handleLogout}
          notifications={4}
          selectedClient={selectedClient}
        />
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title={viewInfo.title}
          subtitle={viewInfo.subtitle}
          profile={profile}
          currentView={currentView}
          notifications={4}
          onNavigate={navigate}
          onLogout={handleLogout}
          cartCount={multiCart ? (selectedClient ? clientCarts.length : carts.length) : undefined}
          selectedClient={isRepDashboard || isRepClients || isRepHistory || isRepMarketing || isProfile || (isAdminNoSidebar && currentView !== 'cart' && currentView !== 'carts') ? null : selectedClient}
        />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
