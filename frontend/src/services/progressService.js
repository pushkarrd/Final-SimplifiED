// Firestore service for tracking and reading progress data
import { db } from './firebase';
import {
    collection, addDoc, getDocs, query, where, orderBy, limit,
    serverTimestamp, doc, updateDoc
} from 'firebase/firestore';

// Log a reading session
export async function logReadingSession(userId, data) {
    try {
        await addDoc(collection(db, 'readingSessions'), {
            userId,
            textLength: data.textLength || 0,
            readingTime: data.readingTime || 0,
            reReadingCount: data.reReadingCount || 0,
            difficultyScore: data.difficultyScore || 0,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error logging reading session:', error);
    }
}

// Log a quiz attempt
export async function logQuizAttempt(userId, data) {
    try {
        await addDoc(collection(db, 'quizAttempts'), {
            userId,
            score: data.score,
            totalQuestions: data.totalQuestions,
            topic: data.topic || 'general',
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error logging quiz attempt:', error);
    }
}

// Log handwriting upload
export async function logHandwritingUpload(userId, data) {
    try {
        await addDoc(collection(db, 'handwritingUploads'), {
            userId,
            errorCount: data.errorCount || 0,
            score: data.score || 0,
            errors: data.errors || [],
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error logging handwriting upload:', error);
    }
}

// Get user's reading sessions
export async function getReadingSessions(userId, maxResults = 20) {
    try {
        const q = query(
            collection(db, 'readingSessions'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(maxResults)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting reading sessions:', error);
        return [];
    }
}

// Get user's quiz attempts
export async function getQuizAttempts(userId, maxResults = 20) {
    try {
        const q = query(
            collection(db, 'quizAttempts'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(maxResults)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting quiz attempts:', error);
        return [];
    }
}

// Get user's handwriting uploads
export async function getHandwritingUploads(userId, maxResults = 20) {
    try {
        const q = query(
            collection(db, 'handwritingUploads'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(maxResults)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting handwriting uploads:', error);
        return [];
    }
}

// Get summary stats for user
export async function getUserStats(userId) {
    const [readings, quizzes, handwriting] = await Promise.all([
        getReadingSessions(userId, 50),
        getQuizAttempts(userId, 50),
        getHandwritingUploads(userId, 50),
    ]);

    const totalReadingTime = readings.reduce((sum, s) => sum + (s.readingTime || 0), 0);
    const avgQuizScore = quizzes.length > 0
        ? quizzes.reduce((sum, q) => sum + (q.score / q.totalQuestions * 100), 0) / quizzes.length
        : 0;
    const totalHandwritingErrors = handwriting.reduce((sum, h) => sum + (h.errorCount || 0), 0);

    return {
        readings,
        quizzes,
        handwriting,
        totalReadingTime,
        avgQuizScore: Math.round(avgQuizScore),
        totalReadingSessions: readings.length,
        totalQuizzes: quizzes.length,
        totalHandwritingUploads: handwriting.length,
        totalHandwritingErrors,
    };
}
