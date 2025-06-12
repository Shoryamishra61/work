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
import { theme } from './theme'; // Import theme

const { width, height } = Dimensions.get('window');

interface Domain {
  id: string;
  name: string;
  icon: any;
  color: string;
  // description: string; // Removed as per new UI for Screen 2
}

const domains: Domain[] = [
  { id: 'ai-ml', name: 'AI & Machine Learning', icon: Brain, color: '#8B5CF6' },
  { id: 'web-dev', name: 'Web Development', icon: Code, color: '#3B82F6' },
  { id: 'mobile-dev', name: 'Mobile Development', icon: Smartphone, color: '#10B981' },
  { id: 'data-science', name: 'Data Science', icon: BarChart3, color: '#F59E0B' },
  { id: 'design', name: 'UI/UX Design', icon: Palette, color: '#EF4444' },
  { id: 'devops', name: 'DevOps & Cloud', icon: Wrench, color: '#6B7280' },
  { id: 'business', name: 'Business & Finance', icon: TrendingUp, color: '#EC4899' },
  { id: 'general', name: 'General Tech', icon: BookOpen, color: '#14B8A6' },
];

const difficultyLevels = [
  { id: 'beginner', name: 'Beginner', description: 'New to the field' },
  { id: 'intermediate', name: 'Intermediate', description: 'Some experience' },
  { id: 'advanced', name: 'Advanced', description: 'Expert level' },
];

interface OnboardingScreenProps {
  initialStep?: number;
  onCompleteRoute?: string;
  isUpdateFlow?: boolean;
}

export default function OnboardingScreen({
  initialStep = 0,
  onCompleteRoute = '/(tabs)',
  isUpdateFlow = false
}: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  const handleDomainToggle = (domainId: string) => {
    setSelectedDomains(prev => 
      prev.includes(domainId) 
        ? prev.filter(id => id !== domainId)
        : [...prev, domainId]
    );
  };

  const handleNext = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      // Save preferences and navigate
      // In a real app, here you would save selectedDomains and selectedDifficulty
      // For example: await saveUserPreferences({ domains: selectedDomains, difficulty: selectedDifficulty });
      router.replace(onCompleteRoute);
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return true;
    if (currentStep === 1) return selectedDomains.length >= 3;
    if (currentStep === 2) return selectedDifficulty !== '';
    return false;
  };

  const renderWelcomeStep = () => (
    <View style={[styles.stepContainer, styles.welcomeStepContainer]}>
      {/* Visuals: Placeholder for a dynamic graphic/animation */}
      <View style={styles.welcomeVisualPlaceholder}>
        <Brain size={width * 0.3} color="#8B5CF6" strokeWidth={1.5} />
      </View>

      <Text style={styles.welcomeTitle}>Edugram: Your Personalized Learning Universe.</Text>
      <Text style={styles.welcomeSubtitle}>
        Short videos & blogs, tailored to what you want to learn.
      </Text>
      {/* CTA is handled by the global nextButton in this structure */}
    </View>
  );

  const renderDomainStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Pick Your Learning Paths</Text>
      <Text style={styles.stepSubtitle}>
        Select 3 or more interests to personalize your feed. You can always change these later.
      </Text>
      
      <ScrollView style={styles.domainsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.domainsGrid}>
          {domains.map((domain) => {
            const IconComponent = domain.icon;
            const isSelected = selectedDomains.includes(domain.id);
            
            return (
              <TouchableOpacity
                key={domain.id}
                style={[
                  styles.domainCard,
                  isSelected && { borderColor: domain.color, backgroundColor: `${domain.color}20` }
                ]}
                onPress={() => handleDomainToggle(domain.id)}
              >
                <View style={[styles.domainIconContainer, { backgroundColor: `${domain.color}30` }]}>
                  <IconComponent size={36} color={domain.color} />
                </View>
                <Text style={[styles.domainName, isSelected && { color: domain.color }]}>
                  {domain.name}
                </Text>
                {/* Domain description removed from card display for this step */}
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
        {selectedDomains.length} selected (minimum 3 required)
      </Text>
    </View>
  );

  // Placeholder for Screen 3: Refine Interests
  // For now, difficulty step will act as a simplified version or placeholder for screen 3
  const renderRefineStep = () => ( // Renamed for clarity
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's Your Level?</Text>
      <Text style={styles.stepSubtitle}>
        This helps us show you the right content difficulty. (This step will be expanded for sub-topics later)
      </Text>
      
      <View style={styles.difficultyContainer}>
        {difficultyLevels.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={[
              styles.difficultyCard,
              selectedDifficulty === level.id && styles.difficultyCardSelected
            ]}
            onPress={() => setSelectedDifficulty(level.id)}
          >
            <Text style={[
              styles.difficultyName,
              selectedDifficulty === level.id && styles.difficultyNameSelected
            ]}>
              {level.name}
            </Text>
            <Text style={[
              styles.difficultyDescription,
              selectedDifficulty === level.id && styles.difficultyDescriptionSelected
            ]}>
              {level.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentStep + 1) / 3) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep + 1} of 3
        </Text>
      </View>

      {currentStep === 0 && renderWelcomeStep()}
      {currentStep === 1 && renderDomainStep()}
      {currentStep === 2 && renderRefineStep()} {/* Changed to renderRefineStep */}

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !canProceed() && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={[ // Adjusted CTA text logic
            styles.nextButtonText,
            !canProceed() && styles.nextButtonTextDisabled
          ]}>
            {currentStep === 0 && !isUpdateFlow ? 'Start Your Learning Journey'
             : currentStep === 1 ? (isUpdateFlow ? 'Next: Confirm Level' : 'Next: Refine Your Interests')
             : (isUpdateFlow ? 'Save My Interests' : 'Finish Setup')}
          </Text>
          {(currentStep !== 0 || isUpdateFlow) && currentStep < 2 && ( // Show chevron if not first step of initial onboarding, and not last step
            <ChevronRight
              size={20}
              color={canProceed() ? "#FFFFFF" : "#999999"}
            />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
    justifyContent: 'center', // Center content for welcome and difficulty
  },
  welcomeStepContainer: { // Specific styling for welcome step vertical alignment
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: height * 0.1, // Push content up a bit from the button
  },
  welcomeVisualPlaceholder: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: 'rgba(139, 92, 246, 0.1)', // Light purple
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 30, // Adjusted size
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16, // Increased margin
  },
  welcomeSubtitle: {
    fontSize: 18, // Adjusted size
    fontFamily: 'Poppins-Medium',
    color: '#E0E0E0', // Slightly less bright than pure white
    textAlign: 'center',
    lineHeight: 26, // Added for readability
    paddingHorizontal: 20, // Ensure it doesn't get too wide
    marginBottom: 20, // Spacing before potential implicit button
  },
  // Removed welcomeDescription and featuresList styles as they are no longer used
  stepTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
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
    alignItems: 'center', // Center content in the card
  },
  domainIconContainer: { // New container for icon with its own background
    width: 64, // Larger icon area
    height: 64,
    borderRadius: 32, // half of width/height
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  domainName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center', // Center domain name
  },
  // domainDescription style removed as it's not displayed on the card
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
  difficultyContainer: {
    flex: 1,
    justifyContent: 'center',
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
  bottomContainer: {
    paddingHorizontal: theme.spacing.space_xl,
    paddingBottom: theme.spacing.space_xxxl, // Increased for more space from bottom edge
    paddingTop: theme.spacing.space_xl,
    backgroundColor: theme.colors.backgroundMain, // Ensure consistency if screen scrolls
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.space_lg,
    borderRadius: theme.radii.radius_full, // Make it fully rounded
  },
  nextButtonDisabled: {
    backgroundColor: theme.colors.backgroundElevated, // Use theme color for disabled state
  },
  nextButtonText: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fontFamilyHeadings, // Using Poppins for main CTA
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.white, // Ensure text is white for primary button
    marginRight: theme.spacing.space_sm,
  },
  // welcomeCtaText can be removed if nextButtonText is now fully themed and dynamic
  nextButtonTextDisabled: {
    color: theme.colors.textDisabled, // Use theme color
  },
});