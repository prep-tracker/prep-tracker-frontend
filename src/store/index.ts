import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './authSlice';
import dashboardReducer from './dashboardSlice';
import resourceReducer from './resourceSlice';
import planReducer from './planSlice';
import sessionReducer from './sessionSlice';
import certificationReducer from './certificationSlice';
import goalReducer from './goalSlice';
import roadmapReducer from './roadmapSlice';
import noteReducer from './noteSlice';
import revisionReducer from './revisionSlice';
import notificationReducer from './notificationSlice';
import interviewReducer from './interviewSlice';
import subscriptionReducer from './subscriptionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    resources: resourceReducer,
    plans: planReducer,
    sessions: sessionReducer,
    certifications: certificationReducer,
    goals: goalReducer,
    roadmaps: roadmapReducer,
    notes: noteReducer,
    revisions: revisionReducer,
    notifications: notificationReducer,
    interviewTopics: interviewReducer,
    subscription: subscriptionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;