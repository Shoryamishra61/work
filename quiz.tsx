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
import { CheckCircle, XCircle, Zap, Trophy, Clock, Target } from 'lucide-react-native';

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

export default function QuizScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

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
      if (currentQuestion < mockQuestions.length - 1) {
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
        setQuizStarted(false);
      }
    });
  };

  const resetQuiz = () => {
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
    const percentage = (score / mockQuestions.length) * 100;
    if (percentage >= 80) return '#10B981';
    if (percentage >= 60) return '#F59E0B';
    return '#EF4444';
  };

  if (!quizStarted && !quizCompleted) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f3460']}
          style={styles.welcomeContainer}
        >
          <View style={styles.welcomeContent}>
            <Zap size={80} color="#8B5CF6" />
            <Text style={styles.welcomeTitle}>Quick Quiz</Text>
            <Text style={styles.welcomeSubtitle}>
              Test your knowledge with interactive questions
            </Text>
            
            <View style={styles.quizStats}>
              <View style={styles.statItem}>
                <Target size={24} color="#8B5CF6" />
                <Text style={styles.statNumber}>{mockQuestions.length}</Text>
                <Text style={styles.statLabel}>Questions</Text>
              </View>
              <View style={styles.statItem}>
                <Clock size={24} color="#8B5CF6" />
                <Text style={styles.statNumber}>30s</Text>
                <Text style={styles.statLabel}>Per Question</Text>
              </View>
              <View style={styles.statItem}>
                <Trophy size={24} color="#8B5CF6" />
                <Text style={styles.statNumber}>Mixed</Text>
                <Text style={styles.statLabel}>Topics</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.startButtonGradient}
              >
                <Text style={styles.startButtonText}>Start Quiz</Text>
                <Zap size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (quizCompleted) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f3460']}
          style={styles.resultContainer}
        >
          <View style={styles.resultContent}>
            <Trophy size={80} color={getScoreColor()} />
            <Text style={styles.resultTitle}>Quiz Complete!</Text>
            
            <View style={styles.scoreContainer}>
              <Text style={[styles.scoreText, { color: getScoreColor() }]}>
                {score}/{mockQuestions.length}
              </Text>
              <Text style={styles.scorePercentage}>
                {Math.round((score / mockQuestions.length) * 100)}%
              </Text>
            </View>

            <Text style={styles.resultMessage}>
              {score === mockQuestions.length 
                ? "Perfect! You're a learning champion! 🏆"
                : score >= mockQuestions.length * 0.8
                ? "Excellent work! Keep it up! 🌟"
                : score >= mockQuestions.length * 0.6
                ? "Good job! Room for improvement! 📚"
                : "Keep learning and try again! 💪"
              }
            </Text>

            <View style={styles.resultActions}>
              <TouchableOpacity style={styles.retryButton} onPress={resetQuiz}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.continueButton}>
                <Text style={styles.continueButtonText}>Continue Learning</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const question = mockQuestions[currentQuestion];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.quizContainer}
      >
        <View style={styles.quizHeader}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentQuestion + 1) / mockQuestions.length) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {currentQuestion + 1}/{mockQuestions.length}
            </Text>
          </View>

          <View style={styles.timerContainer}>
            <Clock size={20} color="#FFFFFF" />
            <Text style={[styles.timerText, { color: timeLeft <= 10 ? '#EF4444' : '#FFFFFF' }]}>
              {timeLeft}s
            </Text>
          </View>
        </View>

        <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
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
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeContent: {
    alignItems: 'center',
    width: '100%',
  },
  welcomeTitle: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 40,
  },
  quizStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginTop: 4,
  },
  startButton: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  quizContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressContainer: {
    flex: 1,
    marginRight: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginLeft: 6,
  },
  questionContainer: {
    flex: 1,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    marginBottom: 20,
  },
  categoryText: {
    color: '#8B5CF6',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  questionText: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    lineHeight: 32,
    marginBottom: 30,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  correctOption: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  incorrectOption: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    flex: 1,
  },
  selectedOptionText: {
    fontFamily: 'Inter-Medium',
  },
  correctOptionText: {
    fontFamily: 'Inter-Medium',
  },
  explanationContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
  },
  explanationTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    lineHeight: 24,
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  resultContent: {
    alignItems: 'center',
    width: '100%',
  },
  resultTitle: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 30,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
  },
  scorePercentage: {
    fontSize: 24,
    fontFamily: 'Inter-Medium',
    color: '#CCCCCC',
    marginTop: 8,
  },
  resultMessage: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
  },
  resultActions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  retryButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 16,
    borderRadius: 25,
    marginRight: 10,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  continueButton: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 25,
    marginLeft: 10,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});