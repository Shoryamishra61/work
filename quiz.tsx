import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  Platform, // Added for potential platform-specific styling
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, XCircle, Zap, Trophy, Clock, Target, ChevronDown } from 'lucide-react-native'; // Added ChevronDown for close/drag handle

// Design System Components
import StyledText from './components/StyledText';
import StyledButton from './components/StyledButton';
import theme from './styles/theme';

const { width } = Dimensions.get('window');

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation: string;
}

interface QuizScreenProps {
  videoTitle?: string;
  onCloseQuiz?: () => void; // Callback to close the quiz overlay
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

export default function QuizScreen({ videoTitle, onCloseQuiz }: QuizScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // Initial time per question
  // quizStarted is effectively true on mount now
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Initialize quiz state (first question)
    if (!quizCompleted) { // Only run timer if quiz is active
        setTimeLeft(30); // Reset timer for each new question (or initial load)
    }
  }, [currentQuestion, quizCompleted]);


  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!quizCompleted && timeLeft > 0 && !showResult) { // Timer runs if quiz active, time left, and no answer shown
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showResult && !quizCompleted) {
      // Auto-submit or mark as incorrect when time runs out
      handleAnswerSelect(-1); // Pass -1 or a special indicator for timeout
    }
    return () => clearTimeout(timer);
  }, [timeLeft, showResult, quizCompleted]);


  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === mockQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion >= mockQuestions.length - 1 && showResult) { // If on last question's explanation
        setQuizCompleted(true); // Mark quiz as completed
        return; // Do not proceed to next question logic
    }

    Animated.fadeOut(fadeAnim, {
      duration: 300,
      useNativeDriver: Platform.OS !== 'web', // useNativeDriver true might cause issues on web
    }).start(() => {
      if (currentQuestion < mockQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        // TimeLeft is now reset by useEffect on currentQuestion change
        Animated.fadeIn(fadeAnim, {
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }).start();
      } else {
        setQuizCompleted(true);
      }
    });
  };

  const handleSkipQuiz = () => {
    console.log("Quiz skipped");
    if (onCloseQuiz) {
      onCloseQuiz();
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    // timeLeft will be reset by useEffect
    setQuizCompleted(false);
    fadeAnim.setValue(1);
  };

  const getScoreColor = () => {
    const percentage = (score / mockQuestions.length) * 100;
    if (percentage >= 80) return theme.colors.success;
    if (percentage >= 60) return theme.colors.warning;
    return theme.colors.error;
  };

  // Removed the initial "Start Quiz" screen. Quiz starts directly with the first question.

  if (quizCompleted) {
    return (
      <View style={styles.panelContainer}>
        <LinearGradient
          colors={[theme.colors.primaryDark, theme.colors.primary, theme.colors.secondary]}
          style={styles.resultContainer}
        >
          <TouchableOpacity onPress={onCloseQuiz} style={styles.closeButton}>
            <ChevronDown size={24} color={theme.colors.white} />
          </TouchableOpacity>
          <View style={styles.resultContent}>
            <Trophy size={80} color={getScoreColor()} />
            <StyledText variant="h2" color="white" style={{ marginTop: theme.spacing.md, marginBottom: theme.spacing.lg }}>
              Quiz Complete!
            </StyledText>
            
            <View style={styles.scoreContainer}>
              <StyledText style={[styles.scoreText, { color: getScoreColor() }]}>
                {score}/{mockQuestions.length}
              </StyledText>
              <StyledText variant="h3" color="textSecondary" style={{ marginTop: theme.spacing.xs }}>
                {Math.round((score / mockQuestions.length) * 100)}%
              </StyledText>
            </View>

            <StyledText variant="body" color="textSecondary" textAlign="center" style={{ marginBottom: theme.spacing.lg }}>
              {score === mockQuestions.length 
                ? "Perfect! You're a learning champion! 🏆"
                : score >= mockQuestions.length * 0.8
                ? "Excellent work! Keep it up! 🌟"
                : score >= mockQuestions.length * 0.6
                ? "Good job! Room for improvement! 📚"
                : "Keep learning and try again! 💪"
              }
            </StyledText>

            <View style={styles.resultActions}>
              <StyledButton title="Try Again" onPress={resetQuiz} variant="outline" size="lg" style={{flex:1, marginRight: theme.spacing.sm}} />
              <StyledButton title="Close" onPress={onCloseQuiz} variant="primary" size="lg" style={{flex:1, marginLeft: theme.spacing.sm}} />
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  const question = mockQuestions[currentQuestion];
  if (!question) return null; // Should not happen if logic is correct

  return (
    <View style={styles.panelContainer}>
      <LinearGradient
        colors={[theme.colors.primaryDark, theme.colors.primary, theme.colors.secondary]}
        style={styles.quizContainer}
      >
        <TouchableOpacity onPress={onCloseQuiz} style={styles.closeButton}>
          <ChevronDown size={24} color={theme.colors.white} />
        </TouchableOpacity>

        {videoTitle && (
          <StyledText variant="caption" color="textSecondary" textAlign="center" style={styles.videoTitleText}>
            Quiz for: {videoTitle}
          </StyledText>
        )}

        <View style={styles.quizHeader}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentQuestion + 1) / mockQuestions.length) * 100}%`, backgroundColor: theme.colors.secondary }
                ]} 
              />
            </View>
            <StyledText variant="small" color="white">
              {currentQuestion + 1}/{mockQuestions.length}
            </StyledText>
          </View>

          <View style={styles.timerContainer}>
            <Clock size={20} color={theme.colors.white} />
            <StyledText variant="body" fontWeight="bold" style={{ color: timeLeft <= 10 ? theme.colors.error : theme.colors.white, marginLeft: theme.spacing.xs }}>
              {timeLeft}s
            </StyledText>
          </View>
        </View>

        <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
          <View style={styles.categoryBadge}>
            <StyledText variant="small" style={{ color: theme.colors.secondary }}>{question.category}</StyledText>
          </View>

          <StyledText variant="h3" color="white" style={styles.questionText}>{question.question}</StyledText>

          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              let buttonVariant: React.ComponentProps<typeof StyledButton>['variant'] = 'outline';
              let icon = null;

              if (showResult) {
                if (isCorrect) {
                  buttonVariant = 'primary'; // Or a specific "correct" variant
                  icon = <CheckCircle size={20} color={theme.colors.white} />;
                } else if (isSelected && !isCorrect) {
                  buttonVariant = 'danger';
                  icon = <XCircle size={20} color={theme.colors.white} />;
                }
              } else if (isSelected) {
                 buttonVariant = 'primary'; // Highlight selected before result
              }

              return (
                <StyledButton
                  key={index}
                  title={option}
                  variant={buttonVariant}
                  onPress={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  rightIcon={icon}
                  style={styles.optionButton}
                  textStyleProps={{textAlign:'left', flex:1}} // Ensure text aligns left
                />
              );
            })}
          </View>

          {!showResult && selectedAnswer === null && (
             <StyledButton
                title="Skip Quiz"
                onPress={handleSkipQuiz}
                variant="ghost"
                size="sm"
                style={styles.skipButton}
            />
          )}

          {showResult && (
            <View style={styles.explanationContainer}>
              <StyledText variant="h3" color="secondary" style={{marginBottom: theme.spacing.sm}}>Explanation:</StyledText>
              <StyledText variant="body" color="textSecondary" style={{lineHeight: theme.typography.fontSizes.md * theme.typography.lineHeights.loose, marginBottom: theme.spacing.md}}>
                {question.explanation}
              </StyledText>
              
              <StyledButton
                title={currentQuestion < mockQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                onPress={handleNextQuestion}
                variant="primary"
                size="lg"
              />
            </View>
          )}
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  panelContainer: { // New root container for the overlay panel
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '85%', // Example height, adjust as needed
    backgroundColor: theme.colors.transparent, // Ensure parent transparency if any part of gradient is transparent
    borderTopLeftRadius: theme.borders.borderRadius.xl,
    borderTopRightRadius: theme.borders.borderRadius.xl,
    overflow: 'hidden', // Important for border radius on gradient
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20, // For Android shadow
  },
  // Removed welcomeContainer, welcomeContent, welcomeTitle, welcomeSubtitle, quizStats, statItem, statNumber, statLabel, startButton, startButtonGradient, startButtonText
  // These were part of the old full-screen start quiz view.
  quizContainer: { // This will now be the content of the panel
    flex: 1,
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg, // More space at top for title/close
  },
  videoTitleText: {
    marginBottom: theme.spacing.sm,
    opacity: 0.8,
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.md,
    alignSelf: 'center', // Centered pull-down affordance
    padding: theme.spacing.sm,
    zIndex: 10, // Ensure it's tappable
  },
  quizHeader: { // Styles adjusted to use theme
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  progressContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  progressBar: {
    height: theme.spacing.sm,
    backgroundColor: theme.colors.black + '40', // Black with opacity
    borderRadius: theme.borders.borderRadius.sm,
    marginBottom: theme.spacing.xs,
  },
  progressFill: { // Color changed in-line
    height: '100%',
    borderRadius: theme.borders.borderRadius.sm,
  },
  // progressText: Replaced by StyledText
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.black + '30', // Black with opacity
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borders.borderRadius.pill,
  },
  // timerText: Replaced by StyledText
  questionContainer: { // Styles adjusted
    flex: 1,
    paddingBottom: theme.spacing.md, // Ensure space for skip button if at bottom
  },
  categoryBadge: { // Styles adjusted
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.secondary + '30', // Secondary with opacity
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borders.borderRadius.pill,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    marginBottom: theme.spacing.md,
  },
  // categoryText: Replaced by StyledText
  questionText: { // Styles adjusted
    marginBottom: theme.spacing.lg,
    // fontSize, fontFamily, color handled by StyledText
  },
  optionsContainer: {
    marginBottom: theme.spacing.md,
  },
  optionButton: { // This style is for StyledButton, so it will be passed to its `style` prop
    marginBottom: theme.spacing.sm,
    // Other styling handled by StyledButton variants
  },
  // selectedOption, correctOption, incorrectOption are handled by StyledButton variants
  // optionText, selectedOptionText, correctOptionText are handled by StyledButton's StyledText
  explanationContainer: { // Styles adjusted
    backgroundColor: theme.colors.black + '30', // Black with opacity
    padding: theme.spacing.md,
    borderRadius: theme.borders.borderRadius.lg,
    marginTop: theme.spacing.md,
  },
  // explanationTitle, explanationText, nextButton, nextButtonText are replaced by Styled components
  resultContainer: { // This is for the quizCompleted state
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  resultContent: {
    alignItems: 'center',
    width: '100%',
  },
  // resultTitle: Replaced by StyledText
  scoreContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  scoreText: { // For the "X/Y" text, specific style for large numbers
    fontFamily: theme.typography.fonts.poppinsBold,
    fontSize: theme.typography.fontSizes.display,
  },
  // scorePercentage, resultMessage: Replaced by StyledText
  resultActions: { // Styles adjusted
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around', // Or space-between
    marginTop: theme.spacing.lg,
  },
  skipButton: {
    marginTop: theme.spacing.md,
    alignSelf: 'center',
  }
  // retryButton, retryButtonText, continueButton, continueButtonText are replaced by StyledButton
});