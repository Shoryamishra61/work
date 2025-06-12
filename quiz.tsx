import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
  XCircle, Zap, Trophy, Clock, Target, SkipForward } from 'lucide-react-native'; // Added SkipForward
import { theme } from './theme'; // Import theme

const { width, height } = Dimensions.get('window'); // Added height

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation: string;
}

const mockQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the primary purpose of a neural network activation function?',
    options: [
      'To store data',
      'To introduce non-linearity',
      'To reduce computation',
      'To increase memory'
    ],
    correctAnswer: 1,
    category: 'AI & ML',
    difficulty: 'Medium',
    explanation: 'Activation functions introduce non-linearity to neural networks, allowing them to learn complex patterns.'
  },
  {
    id: '2',
    question: 'Which React hook is used for managing component state?',
    options: [
      'useEffect',
      'useState',
      'useContext',
      'useReducer'
    ],
    correctAnswer: 1,
    category: 'Web Development',
    difficulty: 'Easy',
    explanation: 'useState is the primary hook for managing local component state in React functional components.'
  },
  {
    id: '3',
    question: 'What does API stand for?',
    options: [
      'Application Programming Interface',
      'Advanced Programming Integration',
      'Automated Program Interaction',
      'Application Process Integration'
    ],
    correctAnswer: 0,
    category: 'General',
    difficulty: 'Easy',
    explanation: 'API stands for Application Programming Interface, which allows different software applications to communicate.'
  }
];

interface QuizScreenProps {
  isOverlayMode?: boolean;
  onClose?: () => void; // For skipping or finishing in overlay mode
  questions?: Question[]; // Optional prop for external questions
}

export default function QuizScreen({
  isOverlayMode = false,
  onClose,
  questions = mockQuestions // Use internal mockQuestions if prop not provided
}: QuizScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(isOverlayMode); // Start immediately if overlay
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Use passed questions length
  const totalQuestions = questions.length;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showResult) {
      handleNextQuestion();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, quizCompleted, showResult]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setQuizCompleted(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === mockQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    Animated.fadeOut(fadeAnim, {
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (currentQuestion < totalQuestions - 1) { // Use totalQuestions
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(30);
        Animated.fadeIn(fadeAnim, {
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        setQuizCompleted(true);
        // In overlay mode, onClose might also navigate away or hide the modal
        if (isOverlayMode && onClose) {
           // Optionally delay closing to show final result briefly
          // setTimeout(onClose, 2000);
        } else {
          setQuizStarted(false); // Only set if not overlay, to show full result screen
        }
      }
    });
  };

  const resetQuiz = () => {
    // If in overlay mode and resetting, it implies starting over within the overlay
    // or closing it to restart from a trigger. For now, simple reset.
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimeLeft(30);
    setQuizStarted(false);
    setQuizCompleted(false);
    fadeAnim.setValue(1);
  };

  const getScoreColor = () => {
    const percentage = (score / totalQuestions) * 100; // Use totalQuestions
    if (percentage >= 80) return theme.colors.success; // Use theme color
    if (percentage >= 60) return theme.colors.accent;  // Use theme color
    return '#EF4444';
  };

  // Render welcome/start screen only if not in overlay mode
  if (!quizStarted && !quizCompleted && !isOverlayMode) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={isOverlayMode ? [theme.colors.backgroundSurface, theme.colors.backgroundElevated] : ['#1a1a2e', '#16213e', '#0f3460']}
          style={isOverlayMode ? styles.quizOverlayContainer : styles.welcomeContainer}
        >
          <View style={styles.welcomeContent}>
            <Zap size={80} color={theme.colors.primary} />
            <Text style={styles.welcomeTitle}>Quick Quiz</Text>
            <Text style={styles.welcomeSubtitle}>
              Test your knowledge with interactive questions
            </Text>
            
            <View style={styles.quizStats}>
              <View style={styles.statItem}>
                <Target size={24} color={theme.colors.primary} />
                <Text style={styles.statNumber}>{totalQuestions}</Text>
                <Text style={styles.statLabel}>Questions</Text>
              </View>
              <View style={styles.statItem}>
                <Clock size={24} color={theme.colors.primary} />
                <Text style={styles.statNumber}>30s</Text>
                <Text style={styles.statLabel}>Per Question</Text>
              </View>
              <View style={styles.statItem}>
                <Trophy size={24} color={theme.colors.primary} />
                <Text style={styles.statNumber}>Mixed</Text>
                <Text style={styles.statLabel}>Topics</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primary+'BF']} // Adjusted gradient
                style={styles.startButtonGradient}
              >
                <Text style={styles.startButtonText}>Start Quiz</Text>
                <Zap size={20} color={theme.colors.white} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (quizCompleted) {
    const resultViewStyle = isOverlayMode ? [styles.quizOverlayContainer, styles.resultOverlay] : styles.resultContainer;
    const resultActionsStyle = isOverlayMode ? [styles.resultActions, styles.resultActionsOverlay] : styles.resultActions;
    return (
      <View style={isOverlayMode ? styles.quizOverlayContainer : styles.container}>
        <LinearGradient
          colors={isOverlayMode ? [theme.colors.backgroundSurface, theme.colors.backgroundElevated] : ['#1a1a2e', '#16213e', '#0f3460']}
          style={resultViewStyle}
        >
          <View style={styles.resultContent}>
            {isOverlayMode && ( // Close button for overlay mode
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <XCircle size={24} color={theme.colors.textMuted} />
              </TouchableOpacity>
            )}
            <Trophy size={isOverlayMode ? 60 : 80} color={getScoreColor()} />
            <Text style={styles.resultTitle}>Quiz Complete!</Text>
            
            <View style={styles.scoreContainer}>
              <Text style={[styles.scoreText, { color: getScoreColor() }]}>
                {score}/{totalQuestions}
              </Text>
              <Text style={styles.scorePercentage}>
                {Math.round((score / totalQuestions) * 100)}%
              </Text>
            </View>

            <Text style={styles.resultMessage}>
              {score === totalQuestions
                ? "Perfect! You're a learning champion! 🏆"
                : score >= totalQuestions * 0.8
                ? "Excellent work! Keep it up! 🌟"
                : score >= totalQuestions * 0.6
                ? "Good job! Room for improvement! 📚"
                : "Keep learning and try again! 💪"
              }
            </Text>

            <View style={resultActionsStyle}>
              {!isOverlayMode && (
                <TouchableOpacity style={styles.retryButton} onPress={resetQuiz}>
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={isOverlayMode ? styles.overlayCtaButton : styles.continueButton}
                onPress={isOverlayMode ? onClose : () => {/* Navigate to learning */}}
              >
                <Text style={isOverlayMode ? styles.overlayCtaButtonText : styles.continueButtonText}>
                  {isOverlayMode ? 'Done' : 'Continue Learning'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  const question = questions[currentQuestion];
  const mainContainerStyle = isOverlayMode ? styles.quizOverlayContainer : styles.container;
  const quizContentStyle = isOverlayMode ? [styles.quizOverlayContent] : styles.quizContainer;


  return (
    <View style={mainContainerStyle}>
      <LinearGradient
        colors={isOverlayMode ? [theme.colors.backgroundSurface, theme.colors.backgroundElevated] : ['#1a1a2e', '#16213e', '#0f3460']}
        style={quizContentStyle}
      >
        <View style={styles.quizHeader}>
          {isOverlayMode && ( // Skip button for overlay mode
            <TouchableOpacity style={styles.skipButton} onPress={onClose}>
              <SkipForward size={20} color={theme.colors.textMuted} />
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          )}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {currentQuestion + 1}/{totalQuestions}
            </Text>
          </View>

          <View style={styles.timerContainer}>
            <Clock size={20} color={theme.colors.textPrimary} />
            <Text style={[styles.timerText, { color: timeLeft <= 10 ? theme.colors.error : theme.colors.textPrimary }]}>
              {timeLeft}s
            </Text>
          </View>
        </View>

        <Animated.View style={[styles.questionContainer, { opacity: fadeAnim, flex: 1 }]}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{question.category}</Text>
          </View>

          <Text style={styles.questionText}>{question.question}</Text>

          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === index && styles.selectedOption,
                  showResult && index === question.correctAnswer && styles.correctOption,
                  showResult && selectedAnswer === index && index !== question.correctAnswer && styles.incorrectOption,
                ]}
                onPress={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
              >
                <Text style={[
                  styles.optionText,
                  selectedAnswer === index && styles.selectedOptionText,
                  showResult && index === question.correctAnswer && styles.correctOptionText,
                ]}>
                  {option}
                </Text>
                {showResult && index === question.correctAnswer && (
                  <CheckCircle size={20} color="#FFFFFF" />
                )}
                {showResult && selectedAnswer === index && index !== question.correctAnswer && (
                  <XCircle size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {showResult && (
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationTitle}>Explanation:</Text>
              <Text style={styles.explanationText}>{question.explanation}</Text>
              
              <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
                <Text style={styles.nextButtonText}>
                  {currentQuestion < mockQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { // This style is for the full-screen quiz
    flex: 1,
    backgroundColor: theme.colors.backgroundMain,
  },
  quizOverlayContainer: { // New style for overlay mode
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.75, // 75% of screen height
    backgroundColor: theme.colors.backgroundSurface,
    borderTopLeftRadius: theme.radii.radius_xl,
    borderTopRightRadius: theme.radii.radius_xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
  },
  quizOverlayContent: { // Inner content padding for overlay
    flex: 1,
    paddingHorizontal: theme.spacing.space_lg,
    paddingTop: theme.spacing.space_lg,
    paddingBottom: theme.spacing.space_lg,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.space_xl,
  },
  welcomeContent: {
    alignItems: 'center',
    width: '100%',
  },
  welcomeTitle: {
    fontSize: theme.typography.fontSizes.display,
    fontFamily: theme.typography.fontFamilyHeadings,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.space_xl,
    marginBottom: theme.spacing.space_md,
  },
  welcomeSubtitle: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilyPrimary,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.space_xxxl,
  },
  quizStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: theme.spacing.space_xxxl,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.typography.fontSizes.xxl,
    fontFamily: theme.typography.fontFamilyHeadings,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.space_sm,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilyPrimary,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.space_xs,
  },
  startButton: {
    width: '100%',
    borderRadius: theme.radii.radius_full,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.space_lg,
    paddingHorizontal: theme.spacing.space_xxxl,
  },
  startButtonText: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fontFamilyHeadings,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.white,
    marginRight: theme.spacing.space_sm,
  },
  quizContainer: { // Used for full screen quiz content area
    flex: 1,
    paddingHorizontal: theme.spacing.space_lg,
    paddingTop: theme.spacing.space_lg, // paddingTop for full screen
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.space_xxl,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: theme.spacing.space_md, // Give some space from progress
  },
  skipButtonText: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.fontSizes.sm,
    marginLeft: theme.spacing.space_xs,
  },
  progressContainer: {
    flex: 1,
    marginRight: theme.spacing.space_lg,
  },
  progressBar: {
    height: 8, // Keep height for visibility
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radii.radius_sm,
    marginBottom: theme.spacing.space_sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.radius_sm,
  },
  progressText: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textPrimary,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundElevated,
    paddingHorizontal: theme.spacing.space_md,
    paddingVertical: theme.spacing.space_sm,
    borderRadius: theme.radii.radius_full,
  },
  timerText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.bold,
    marginLeft: theme.spacing.space_xs,
  },
  questionContainer: {
    // flex: 1, // This will be handled by Animated.View style prop
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary + '33', // Tinted
    paddingHorizontal: theme.spacing.space_lg,
    paddingVertical: theme.spacing.space_sm,
    borderRadius: theme.radii.radius_full,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginBottom: theme.spacing.space_xl,
  },
  categoryText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.medium,
    fontSize: theme.typography.fontSizes.sm,
  },
  questionText: {
    fontSize: theme.typography.fontSizes.xxl,
    fontFamily: theme.typography.fontFamilyHeadings,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.textPrimary,
    lineHeight: theme.typography.fontSizes.xxl * 1.3,
    marginBottom: theme.spacing.space_xxl,
  },
  optionsContainer: {
    marginBottom: theme.spacing.space_xl,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.backgroundElevated,
    padding: theme.spacing.space_lg,
    borderRadius: theme.radii.radius_md,
    marginBottom: theme.spacing.space_md,
    borderWidth: 2,
    borderColor: 'transparent', // Default no border
  },
  selectedOption: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '33',
  },
  correctOption: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.success + '33',
  },
  incorrectOption: {
    borderColor: theme.colors.error,
    backgroundColor: theme.colors.error + '33',
  },
  optionText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilyPrimary,
    color: theme.colors.textPrimary,
    flex: 1, // Ensure text wraps if long
  },
  selectedOptionText: {
    fontWeight: theme.typography.fontWeights.medium,
  },
  correctOptionText: {
    fontWeight: theme.typography.fontWeights.medium,
  },
  explanationContainer: {
    backgroundColor: theme.colors.backgroundElevated,
    padding: theme.spacing.space_xl,
    borderRadius: theme.radii.radius_lg,
    marginTop: theme.spacing.space_xl,
  },
  explanationTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fontFamilyHeadings,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.space_sm,
  },
  explanationText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilyPrimary,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.fontSizes.md * 1.5,
    marginBottom: theme.spacing.space_xl,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.space_md,
    paddingHorizontal: theme.spacing.space_xl,
    borderRadius: theme.radii.radius_full,
    alignSelf: 'center',
  },
  nextButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.white,
  },
  resultContainer: { // For full screen result
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.space_xl,
  },
  resultOverlay: { // Specific style for result in overlay mode
    borderTopLeftRadius: theme.radii.radius_xl,
    borderTopRightRadius: theme.radii.radius_xl,
    paddingBottom: theme.spacing.space_md, // Add some padding at the bottom
  },
  resultContent: {
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing.space_md, // Padding for content within overlay/result screen
  },
  closeButton: { // For closing overlay result
    position: 'absolute',
    top: theme.spacing.space_md,
    right: theme.spacing.space_md,
    zIndex: 10,
  },
  resultTitle: {
    fontSize: theme.typography.fontSizes.display,
    fontFamily: theme.typography.fontFamilyHeadings,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.space_xl,
    marginBottom: theme.spacing.space_xxl,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.space_xl,
  },
  scoreText: {
    fontSize: theme.typography.fontSizes.display * 1.5, // Larger score
    fontFamily: theme.typography.fontFamilyHeadings,
    fontWeight: theme.typography.fontWeights.bold,
  },
  scorePercentage: {
    fontSize: theme.typography.fontSizes.xxl,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.space_sm,
  },
  resultMessage: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fontFamilyPrimary,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.space_xxxl,
    lineHeight: theme.typography.fontSizes.lg * 1.5,
  },
  resultActions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  resultActionsOverlay: { // Specific for overlay to manage button layout
    paddingHorizontal: theme.spacing.space_md,
  },
  retryButton: {
    flex: 1,
    backgroundColor: theme.colors.backgroundElevated,
    paddingVertical: theme.spacing.space_lg,
    borderRadius: theme.radii.radius_full,
    marginRight: theme.spacing.space_sm,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.textPrimary,
  },
  continueButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.space_lg,
    borderRadius: theme.radii.radius_full,
    marginLeft: theme.spacing.space_sm,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.white,
  },
  overlayCtaButton: { // For "Done" button in overlay result
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.space_lg,
    borderRadius: theme.radii.radius_full,
    alignItems: 'center',
  },
  overlayCtaButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.white,
  }
});