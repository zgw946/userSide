//改变会话
export const changeSessionType = (info) => ({
  type: 'online/change_session_type',
  value: info
});
// 常见问题
export const changeSessionFaqType = (info) => ({
  type: 'question/change_sessionFaq_type',
  value: info
});