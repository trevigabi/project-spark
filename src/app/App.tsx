import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { Sidebar, TopBar } from "./components/Sidebar";
import type { View } from "./components/Sidebar";
import type { Client } from "./data/mockData";
import { DashboardAdmin } from "./components/DashboardAdmin";
import { DashboardRep } from "./components/DashboardRep";
import { DashboardLojista } from "./components/DashboardLojista";
import { CatalogPage } from "./components/CatalogPage";
import { OrderGrade } from "./components/OrderGrade";
import { CartPage } from "./components/CartPage";
import { OrderHistory } from "./components/OrderHistory";
import { LojistaHistoryDashboard } from "./components/LojistaHistoryDashboard";
import { MarketingStudio } from "./components/MarketingStudio";
import { SelloutDashboard } from "./components/SelloutDashboard";
import { AdminPage } from "./components/AdminPage";
import { ClientsPage } from "./components/ClientsPage";
import { LojistaFiltersSidebar, defaultFilters, type CatalogFilters } from "./components/LojistaFiltersSidebar";

type Profile = 'admin' | 'rep' | 'lojista';

const viewTitles: Record<View, { title: string; subtitle?: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Visão geral do seu negócio' },
  catalog: { title: 'Catálogo' },
  'order-grade': { title: 'Pedido por Grade', subtitle: 'Monte pedidos em menos de 2 minutos' },
  cart: { title: 'Carrinho', subtitle: 'Revise e finalize seu pedido' },
  history: { title: 'Histórico de Pedidos', subtitle: 'Todos os seus pedidos' },
  marketing: { title: 'Estúdio de Marketing IA', subtitle: 'Crie campanhas profissionais automaticamente' },
  sellout: { title: 'Sell-out Intelligence', subtitle: 'Análise de performance comercial' },
  admin: { title: 'Gestão', subtitle: 'Usuários, produtos, políticas e configurações' },
  clients: { title: 'Clientes', subtitle: 'Sua carteira de clientes' },
};

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [profile, setProfile] = useState<Profile>('admin');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [catalogFilters, setCatalogFilters] = useState<CatalogFilters>(defaultFilters);

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

  const viewInfo = viewTitles[currentView];

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
      case 'catalog':
        return (
          <CatalogPage
            onNavigate={navigate}
            selectedClient={selectedClient}
            externalFilters={profile === 'lojista' ? catalogFilters : undefined}
            onExternalFiltersChange={profile === 'lojista' ? setCatalogFilters : undefined}
          />
        );
      case 'order-grade':
        return <OrderGrade onNavigate={navigate} selectedClient={selectedClient} />;
      case 'cart':
        return <CartPage onNavigate={navigate} />;
      case 'history':
        if (profile === 'lojista') return <LojistaHistoryDashboard onNavigate={navigate} />;
        return <OrderHistory onNavigate={navigate} profile={profile} />;
      case 'marketing':
        return <MarketingStudio />;
      case 'sellout':
        return <SelloutDashboard />;
      case 'admin':
        return <AdminPage />;
      case 'clients':
        return <ClientsPage onNavigate={navigate} selectedClient={selectedClient} setSelectedClient={setSelectedClient} />;
      default:
        return <DashboardAdmin onNavigate={navigate} />;
    }
  };

  const isLojistaCatalog = profile === 'lojista' && currentView === 'catalog';
  const isRepClients = profile === 'rep' && currentView === 'clients';
  const hideSidebar = isRepClients;

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      {isLojistaCatalog ? (
        <LojistaFiltersSidebar
          filters={catalogFilters}
          onChange={setCatalogFilters}
          onLogout={handleLogout}
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
          notifications={4}
          onNavigate={navigate}
          onLogout={handleLogout}
          selectedClient={selectedClient}
        />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
