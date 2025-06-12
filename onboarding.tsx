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

const { width, height } = Dimensions.get('window');

interface Domain {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
}

const domains: Domain[] = [
  { id: 'ai-ml', name: 'AI & Machine Learning', icon: Brain, color: '#8B5CF6', description: 'Neural networks, deep learning, AI algorithms' },
  { id: 'web-dev', name: 'Web Development', icon: Code, color: '#3B82F6', description: 'React, JavaScript, HTML/CSS, frameworks' },
  { id: 'mobile-dev', name: 'Mobile Development', icon: Smartphone, color: '#10B981', description: 'React Native, iOS, Android development' },
  { id: 'data-science', name: 'Data Science', icon: BarChart3, color: '#F59E0B', description: 'Python, analytics, visualization, statistics' },
  { id: 'design', name: 'UI/UX Design', icon: Palette, color: '#EF4444', description: 'Figma, design systems, user experience' },
  { id: 'devops', name: 'DevOps & Cloud', icon: Wrench, color: '#6B7280', description: 'AWS, Docker, CI/CD, infrastructure' },
  { id: 'business', name: 'Business & Finance', icon: TrendingUp, color: '#EC4899', description: 'Entrepreneurship, investing, marketing' },
  { id: 'general', name: 'General Tech', icon: BookOpen, color: '#14B8A6', description: 'Programming fundamentals, career advice' },
];

const difficultyLevels = [
  { id: 'beginner', name: 'Beginner', description: 'New to the field' },
  { id: 'intermediate', name: 'Intermediate', description: 'Some experience' },
  { id: 'advanced', name: 'Advanced', description: 'Expert level' },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
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
      // Save preferences and navigate to main app
      router.replace('/(tabs)');
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return true;
    if (currentStep === 1) return selectedDomains.length >= 3;
    if (currentStep === 2) return selectedDifficulty !== '';
    return false;
  };

  const renderWelcomeStep = () => (
    <View style={styles.stepContainer}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.welcomeGradient}
      >
        <Text style={styles.welcomeTitle}>Welcome to Edugram</Text>
        <Text style={styles.welcomeSubtitle}>
          Your personalized learning universe
        </Text>
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
  );

  const renderDomainStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Pick Your Learning Paths</Text>
      <Text style={styles.stepSubtitle}>
        Select 3 or more interests to personalize your feed
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

  const renderDifficultyStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's Your Level?</Text>
      <Text style={styles.stepSubtitle}>
        This helps us show you the right content difficulty
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
      {currentStep === 2 && renderDifficultyStep()}

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !canProceed() && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={[
            styles.nextButtonText,
            !canProceed() && styles.nextButtonTextDisabled
          ]}>
            {currentStep === 2 ? 'Start Learning' : 'Continue'}
          </Text>
          <ChevronRight 
            size={20} 
            color={canProceed() ? "#FFFFFF" : "#999999"} 
          />
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
  },
  welcomeGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
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
    color: '#B0B0B0', // Slightly brighter for better readability
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
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 25,
  },
  nextButtonDisabled: {
    backgroundColor: '#333333',
  },
  nextButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  nextButtonTextDisabled: {
    color: '#999999',
  },
});