import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronRight, BookOpen, Brain, Code, TrendingUp, Palette, Wrench, Smartphone, ChartBar as BarChart3 } from 'lucide-react-native';

// Design System Components
import StyledText from '../components/StyledText'; // Assuming components is a sibling of parent of onboarding if onboarding is in a folder
import StyledButton from '../components/StyledButton'; // Or './components/StyledButton' if onboarding.tsx is at root
import theme from '../styles/theme'; // Or './styles/theme'

const { width, height } = Dimensions.get('window');

interface SubTopic {
  id: string;
  name: string;
  description?: string;
}

interface Domain {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  subTopics: SubTopic[];
}

interface SelectedDomainInfo {
  id: string;
  subTopics: string[];
  difficulty: string;
}

const domains: Domain[] = [
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    icon: Brain,
    color: '#8B5CF6',
    description: 'Neural networks, deep learning, AI algorithms',
    subTopics: [
      { id: 'beginner-concepts', name: 'Beginner Concepts' },
      { id: 'python-for-ai', name: 'Python for AI' },
      { id: 'neural-networks', name: 'Neural Networks' },
    ],
  },
  {
    id: 'web-dev',
    name: 'Web Development',
    icon: Code,
    color: '#3B82F6',
    description: 'React, JavaScript, HTML/CSS, frameworks',
    subTopics: [
      { id: 'frontend', name: 'Frontend Frameworks' },
      { id: 'backend', name: 'Backend Development' },
      { id: 'fullstack', name: 'Full-Stack Development' },
    ],
  },
  {
    id: 'mobile-dev',
    name: 'Mobile Development',
    icon: Smartphone,
    color: '#10B981',
    description: 'React Native, iOS, Android development',
    subTopics: [
      { id: 'react-native', name: 'React Native' },
      { id: 'swift-ios', name: 'Swift (iOS)' },
      { id: 'kotlin-android', name: 'Kotlin (Android)' },
    ],
  },
  {
    id: 'data-science',
    name: 'Data Science',
    icon: BarChart3,
    color: '#F59E0B',
    description: 'Python, analytics, visualization, statistics',
    subTopics: [
      { id: 'data-analysis', name: 'Data Analysis' },
      { id: 'machine-learning-models', name: 'Machine Learning Models' },
      { id: 'data-visualization', name: 'Data Visualization' },
    ],
  },
  {
    id: 'design',
    name: 'UI/UX Design',
    icon: Palette,
    color: '#EF4444',
    description: 'Figma, design systems, user experience',
    subTopics: [
      { id: 'user-research', name: 'User Research' },
      { id: 'wireframing-prototyping', name: 'Wireframing & Prototyping' },
      { id: 'visual-design', name: 'Visual Design' },
    ],
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    icon: Wrench,
    color: '#6B7280',
    description: 'AWS, Docker, CI/CD, infrastructure',
    subTopics: [
      { id: 'aws', name: 'Amazon Web Services (AWS)' },
      { id: 'docker-kubernetes', name: 'Docker & Kubernetes' },
      { id: 'ci-cd', name: 'CI/CD Pipelines' },
    ],
  },
  {
    id: 'business',
    name: 'Business & Finance',
    icon: TrendingUp,
    color: '#EC4899',
    description: 'Entrepreneurship, investing, marketing',
    subTopics: [
      { id: 'startups', name: 'Startups & Entrepreneurship' },
      { id: 'personal-finance', name: 'Personal Finance' },
      { id: 'digital-marketing', name: 'Digital Marketing' },
    ],
  },
  {
    id: 'general',
    name: 'General Tech',
    icon: BookOpen,
    color: '#14B8A6',
    description: 'Programming fundamentals, career advice',
    subTopics: [
      { id: 'coding-basics', name: 'Coding Basics' },
      { id: 'tech-careers', name: 'Tech Career Paths' },
      { id: 'emerging-tech', name: 'Emerging Technologies' },
    ],
  },
];

const difficultyLevels = [
  { id: 'beginner', name: 'Beginner', description: 'New to the field' },
  { id: 'intermediate', name: 'Intermediate', description: 'Some experience' },
  { id: 'advanced', name: 'Advanced', description: 'Expert level' },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDomains, setSelectedDomains] = useState<SelectedDomainInfo[]>([]);

  const handleDomainToggle = (domainId: string) => {
    setSelectedDomains(prev => {
      const existingDomain = prev.find(d => d.id === domainId);
      if (existingDomain) {
        return prev.filter(d => d.id !== domainId);
      } else {
        return [...prev, { id: domainId, subTopics: [], difficulty: '' }];
      }
    });
  };

  const handleNext = () => {
    const totalSteps = 2 + selectedDomains.length;

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // This is the final step, save preferences and navigate
      console.log('Onboarding complete. Preferences:', selectedDomains);
      router.replace('/(tabs)');
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return true; // Welcome step
    if (currentStep === 1) return selectedDomains.length >= 3; // Domain selection (min 3)

    // Refinement steps
    if (currentStep >= 2 && currentStep < 2 + selectedDomains.length) {
      const currentDomainIndex = currentStep - 2;
      if (selectedDomains[currentDomainIndex]) {
        // Allow proceeding if difficulty is set (or was 'skipped')
        return selectedDomains[currentDomainIndex].difficulty !== '';
      }
      return false; // Should not happen
    }

    // After last refinement step, ready to proceed to app
    if (currentStep === 2 + selectedDomains.length -1) return true;


    // If on the (now virtual) final step after all refinements, allow proceeding
    // This case might not be strictly necessary if button text changes to "Start Learning"
    // and handleNext directly navigates.
    if (currentStep === 2 + selectedDomains.length) return true;


    return false; // Default deny
  };

  const renderWelcomeStep = () => (
    <View style={styles.stepContainer}>
      <LinearGradient
        colors={['#667eea', '#764ba2']} // These colors could come from theme.colors if desired
        style={styles.welcomeGradient}
      >
        <StyledText variant="h1" color="white" textAlign="center" style={{ marginBottom: theme.spacing.sm }}>Welcome to Edugram</StyledText>
        <StyledText variant="h3" color="white" textAlign="center" style={{ opacity: 0.9, marginBottom: theme.spacing.xs }}>
          Your personalized learning universe
        </StyledText>
        <Text style={styles.welcomeDescription}>
          Short videos & articles, tailored to what you want to learn
        </Text>
        
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Brain size={24} color="#FFFFFF" />
            <Text style={styles.featureText}>AI-powered recommendations</Text>
          </View>
          <View style={styles.featureItem}>
            <BookOpen size={24} color="#FFFFFF" />
            <Text style={styles.featureText}>Bite-sized learning content</Text>
          </View>
          <View style={styles.featureItem}>
            <TrendingUp size={24} color="#FFFFFF" />
            <Text style={styles.featureText}>Track your progress</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  };

  const handleSubTopicToggle = (domainId: string, subTopicId: string) => {
    setSelectedDomains(prev => prev.map(domain => {
      if (domain.id === domainId) {
        const newSubTopics = domain.subTopics.includes(subTopicId)
          ? domain.subTopics.filter(st => st !== subTopicId)
          : [...domain.subTopics, subTopicId];
        return { ...domain, subTopics: newSubTopics };
      }
      return domain;
    }));
  };

  const handleDifficultySelect = (domainId: string, difficulty: string) => {
    setSelectedDomains(prev => prev.map(domain =>
      domain.id === domainId ? { ...domain, difficulty } : domain
    ));
  );

  const renderDomainStep = () => (
    <View style={styles.stepContainer}>
      <StyledText variant="h2" color="white" textAlign="center" style={{ marginTop: theme.spacing.lg, marginBottom: theme.spacing.xs }}>Pick Your Learning Paths</StyledText>
      <StyledText variant="body" color="textSecondary" textAlign="center" style={{ marginBottom: theme.spacing.lg, lineHeight: theme.typography.fontSizes.md * theme.typography.lineHeights.loose }}>
        Select 3 or more interests to personalize your feed
      </StyledText>
      
      <ScrollView style={styles.domainsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.domainsGrid}>
          {domains.map((domain) => {
            const IconComponent = domain.icon;
            const isSelected = selectedDomains.some(d => d.id === domain.id);
            
            return (
              <TouchableOpacity
                key={domain.id}
                style={[
                  styles.domainCard,
                  isSelected && { borderColor: domain.color, backgroundColor: `${domain.color}20` }
                ]}
                onPress={() => handleDomainToggle(domain.id)}
              >
                <View style={[styles.domainIcon, { backgroundColor: domain.color }]}>
                  <IconComponent size={24} color="#FFFFFF" />
                </View>
                <Text style={[styles.domainName, isSelected && { color: domain.color }]}>
                  {domain.name}
                </Text>
                <Text style={styles.domainDescription}>
                  {domain.description}
                </Text>
                {isSelected && (
                  <View style={[styles.selectedBadge, { backgroundColor: domain.color }]}>
                    <Text style={styles.selectedBadgeText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      
      <Text style={styles.selectionCount}>
        {selectedDomains.length}/8 selected (minimum 3 required)
      </Text>
    </View>
  );

  // renderDifficultyStep is removed as difficulty is now per-domain

  const renderRefinementStep = () => {
    const currentDomainIndex = currentStep - 2;
    if (currentDomainIndex < 0 || currentDomainIndex >= selectedDomains.length) {
      return null; // Should not happen if logic is correct
    }
    const currentDomainInfo = selectedDomains[currentDomainIndex];
    const domainDetails = domains.find(d => d.id === currentDomainInfo.id);

    if (!domainDetails) return null; // Should not happen

    return (
      <View style={styles.stepContainer}>
        <StyledText variant="h2" color="white" textAlign="center" style={{ marginTop: theme.spacing.lg, marginBottom: theme.spacing.xs }}>Refine: {domainDetails.name}</StyledText>
        <StyledText variant="body" color="textSecondary" textAlign="center" style={{ marginBottom: theme.spacing.lg, lineHeight: theme.typography.fontSizes.md * theme.typography.lineHeights.loose }}>
          Select sub-topics and your current skill level in {domainDetails.name}.
        </StyledText>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Sub-topics selection */}
          <Text style={styles.refinementSectionTitle}>Choose Sub-Topics (Optional)</Text>
          <View style={styles.subTopicsContainer}>
            {domainDetails.subTopics.map(subTopic => {
              const isSelected = currentDomainInfo.subTopics.includes(subTopic.id);
              return (
                <TouchableOpacity
                  key={subTopic.id}
                  style={[
                    styles.subTopicChip,
                    isSelected && { backgroundColor: domainDetails.color, borderColor: domainDetails.color }
                  ]}
                  onPress={() => handleSubTopicToggle(domainDetails.id, subTopic.id)}
                >
                  <Text style={[styles.subTopicChipText, isSelected && styles.subTopicChipTextSelected]}>
                    {subTopic.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Difficulty selection */}
          <Text style={styles.refinementSectionTitle}>Select Your Skill Level</Text>
          <View style={styles.difficultyContainerRefinement}>
            {difficultyLevels.map(level => {
              const isSelected = currentDomainInfo.difficulty === level.id;
              return (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.difficultyCard,
                    isSelected && { borderColor: domainDetails.color, backgroundColor: `${domainDetails.color}20` }
                  ]}
                  onPress={() => handleDifficultySelect(domainDetails.id, level.id)}
                >
                  <Text style={[
                    styles.difficultyName,
                    isSelected && { color: domainDetails.color }
                  ]}>
                    {level.name}
                  </Text>
                  <Text style={[
                    styles.difficultyDescription,
                    isSelected && styles.difficultyDescriptionSelected // Keep original white for selected desc
                  ]}>
                    {level.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Skip for this domain button */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => {
              handleDifficultySelect(domainDetails.id, 'skipped');
              Promise.resolve().then(() => {
                handleNext();
              });
            }}
          >
            <Text style={styles.skipButtonText}>Skip refinement for {domainDetails.name}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentStep + 1) / (selectedDomains.length > 0 ? 2 + selectedDomains.length : 2)) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {selectedDomains.length > 0 ? 2 + selectedDomains.length : 2}
          {currentStep >= 2 && currentStep < 2 + selectedDomains.length && selectedDomains[currentStep - 2] ? ` (Refining: ${domains.find(d => d.id === selectedDomains[currentStep - 2].id)?.name})` : ''}
        </Text>
      </View>

      {currentStep === 0 && renderWelcomeStep()}
      {currentStep === 1 && renderDomainStep()}
      {currentStep >= 2 && currentStep < 2 + selectedDomains.length && renderRefinementStep()}
      {/* {currentStep === 2 && renderDifficultyStep()} */}


      <View style={styles.bottomContainer}>
        <StyledButton
          title={currentStep >= (selectedDomains.length > 0 ? 1 + selectedDomains.length : 1) ? 'Start Learning' : 'Continue'}
          onPress={handleNext}
          disabled={!canProceed()}
          variant="primary"
          size="lg"
          rightIcon={<ChevronRight size={20} color={canProceed() ? theme.colors.white : theme.colors.textSecondary} />}
          fullWidth // Make button full width
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (keep existing styles)
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, // Use theme color
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#CCCCCC',
    textAlign: 'center',
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  // welcomeTitle: { // Replaced by StyledText
  //   fontSize: 32,
  //   fontFamily: 'Poppins-Bold',
  //   color: '#FFFFFF',
  //   textAlign: 'center',
  //   marginBottom: 12,
  // },
  // welcomeSubtitle: { // Replaced by StyledText
  //   fontSize: 20,
  //   fontFamily: 'Poppins-Medium',
  //   color: '#FFFFFF',
  //   textAlign: 'center',
  //   marginBottom: 8,
  // },
  welcomeDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#E5E7EB',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  featuresList: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  // stepTitle: { // Replaced by StyledText
  //   fontSize: 28,
  //   fontFamily: 'Poppins-Bold',
  //   color: '#FFFFFF',
  //   textAlign: 'center',
  //   marginTop: 20,
  //   marginBottom: 8,
  // },
  // stepSubtitle: { // Replaced by StyledText
  //   fontSize: 16,
  //   fontFamily: 'Inter-Regular',
  //   color: '#CCCCCC',
  //   textAlign: 'center',
  //   marginBottom: 30,
  //   lineHeight: 24,
  // },
  domainsContainer: {
    flex: 1,
  },
  domainsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  domainCard: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#333333',
    position: 'relative',
  },
  domainIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  domainName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  domainDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    lineHeight: 16,
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  selectionCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    textAlign: 'center',
    marginTop: 10,
  },
  // difficultyContainer: { // Original global difficulty container
  //   flex: 1,
  //   justifyContent: 'center',
  // },
  difficultyContainerRefinement: { // For per-domain difficulty
    marginVertical: 20,
  },
  difficultyCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#333333',
  },
  difficultyCardSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  difficultyName: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  difficultyNameSelected: {
    color: '#8B5CF6',
  },
  difficultyDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  difficultyDescriptionSelected: {
    color: '#FFFFFF',
  },
  refinementSectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 12,
  },
  subTopicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  subTopicChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#444444',
  },
  subTopicChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  subTopicChipTextSelected: {
    color: '#FFFFFF', // Text color can remain white or change based on contrast needs
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderColor: '#555555',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#AAAAAA',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  // nextButton: { // Replaced by StyledButton
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: '#8B5CF6',
  //   paddingVertical: 16,
  //   borderRadius: 25,
  // },
  // nextButtonDisabled: { // Handled by StyledButton's disabled state
  //   backgroundColor: '#333333',
  // },
  // nextButtonText: { // Handled by StyledButton's text props
  //   fontSize: 18,
  //   fontFamily: 'Poppins-SemiBold',
  //   color: '#FFFFFF',
  //   marginRight: 8,
  // },
  // nextButtonTextDisabled: { // Handled by StyledButton's disabled state
  //   color: '#999999',
  // },
});