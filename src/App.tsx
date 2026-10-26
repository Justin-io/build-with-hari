import React, { useState } from 'react';
import { FluidMagneticBackground } from './components/FluidMagneticBackground';
import { FerrofluidSphere } from './components/FerrofluidSphere';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { SelectedWork } from './components/SelectedWork';
import { ProcessSection } from './components/ProcessSection';
import { PricingConfigurator } from './components/PricingConfigurator';
import { RequirementsForm } from './components/RequirementsForm';
import { TrustSection } from './components/TrustSection';
import { FounderSection } from './components/FounderSection';
import { AcademicIntegritySection } from './components/AcademicIntegritySection';
import { Footer } from './components/Footer';
import { AiDocumentEstimatorModal } from './components/AiDocumentEstimatorModal';
import { AiEstimatorFab } from './components/AiEstimatorFab';
import { ProjectTypeId, ProjectConfig } from './utils/pricing';

export default function App() {
  // Configurator state carried over to custom request form
  const [selectedProjectType, setSelectedProjectType] = useState<ProjectTypeId>('web_app');
  const [attachedConfig, setAttachedConfig] = useState<ProjectConfig | null>(null);
  const [attachedTotalINR, setAttachedTotalINR] = useState<number | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartProjectClick = () => {
    scrollToSection('custom-request');
  };

  const handleBuildEstimateClick = () => {
    scrollToSection('pricing');
  };

  const handleExploreWorkClick = () => {
    scrollToSection('work');
  };

  const handleSelectServiceCategory = (typeId: ProjectTypeId) => {
    setSelectedProjectType(typeId);
    scrollToSection('pricing');
  };

  const handleSelectDocumentation = () => {
    scrollToSection('pricing');
  };

  const handleContinueWithEstimate = (config: ProjectConfig, totalINR: number) => {
    setAttachedConfig(config);
    setAttachedTotalINR(totalINR);
    scrollToSection('custom-request');
  };

  const handleApplyAiPlan = (config: ProjectConfig, totalINR: number) => {
    setAttachedConfig(config);
    setAttachedTotalINR(totalINR);
    setSelectedProjectType(config.projectType);
    scrollToSection('custom-request');
  };

  const handleClearAttachedEstimate = () => {
    setAttachedConfig(null);
    setAttachedTotalINR(null);
  };

  return (
    <div className="relative min-h-screen bg-[#F5F5F7] text-[#171717] selection:bg-[#4778F5] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Interactive 3D Reflective Floating Ferrofluid Sphere */}
      <FerrofluidSphere />

      {/* Interactive Fluid Magnetic Background Field */}
      <FluidMagneticBackground />

      {/* Main Studio Content Structure */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onStartProjectClick={handleStartProjectClick} />

        <main className="flex-1">
          <Hero
            onBuildEstimateClick={handleBuildEstimateClick}
            onExploreWorkClick={handleExploreWorkClick}
            onUploadDocEstimateClick={() => setIsAiModalOpen(true)}
          />

          <ServicesSection
            onSelectCategory={handleSelectServiceCategory}
            onSelectDocumentation={handleSelectDocumentation}
          />

          <SelectedWork />

          <ProcessSection />

          <PricingConfigurator
            initialProjectType={selectedProjectType}
            onContinueWithEstimate={handleContinueWithEstimate}
            onCustomProjectClick={() => scrollToSection('custom-request')}
          />

          <RequirementsForm
            attachedConfig={attachedConfig}
            attachedTotalINR={attachedTotalINR}
            onClearAttachedEstimate={handleClearAttachedEstimate}
          />

          <TrustSection />

          <AcademicIntegritySection />

          <FounderSection />
        </main>

        <Footer
          onStartProjectClick={handleStartProjectClick}
          onBuildEstimateClick={handleBuildEstimateClick}
        />

        {/* Dedicated Floating Action Button (FAB) for AI Syllabus Estimator */}
        <AiEstimatorFab onClick={() => setIsAiModalOpen(true)} />

        {/* AI Document Scope & Budget Estimator Modal powered by Gemini 3.1 Flash Lite */}
        <AiDocumentEstimatorModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          onApplyPlanToCart={handleApplyAiPlan}
        />
      </div>
    </div>
  );
}
