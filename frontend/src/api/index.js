import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

export const getTopics = () => api.get('/topics');
export const getQuestionsByTopic = (topicId) => api.get(`/questions/topic/${topicId}`);
export const getQuestion = (id) => api.get(`/questions/${id}`);