import { test as base } from '../../fixtures/apiFixtures';
import { expect } from '@playwright/test';
import { createArticleData } from '../../utils/article.factory';

base('check article creation', { tag: ['@smoke', '@regression', '@api'] }, async ({ apiClient, testUser }) => {
  const testArticleData = createArticleData();
  const response = await apiClient.createArticle(testArticleData, testUser.user.token);
  expect(response.title, 'Title is not correct' + testArticleData.article.title).toBe(testArticleData.article.title);
  expect(response.tagList, 'Tag list is not correct' + testArticleData.article.tagList).toEqual(testArticleData.article.tagList);
  expect(response.body, 'Body is not correct' + testArticleData.article.body).toBe(testArticleData.article.body || '');
});

base('check article comments', { tag: ['@regression', '@api'] }, async ({ apiClient, testUser }) => {
  const testArticleData = createArticleData();

  const createArticleresponse = await base.step('Create article', async () => {
    return await apiClient.createArticle(testArticleData, testUser.user.token);
  });

  const createdCommentResponse = await base.step('Add comments', async () => {
    const comentsList = await apiClient.getComments(createArticleresponse.slug, testUser.user.token);
    expect(comentsList.comments.length, 'Check new article should have no comments').toBe(0);

    const createdCommentResponse = await apiClient.addComments(createArticleresponse.slug, 'test comment from user ' + testUser.user.email, testUser.user.token);
    expect(createdCommentResponse.comment.body, 'Comment should be addes').toBe('test comment from user ' + testUser.user.email);
    expect(createdCommentResponse.comment.author.username, 'Check comment author').toBe(testUser.user.username);
    return createdCommentResponse;
  });

  await base.step('Check comment data', async () => {
    const commentsList = await apiClient.getComments(createArticleresponse.slug, testUser.user.token);
    expect(commentsList.comments.length, 'Comments count should be 1').toBe(1);
    const expectedComment = await commentsList.comments.find((comment) => comment.id === createdCommentResponse.comment.id);
    expect(expectedComment, 'Created comment should be in the list').toBeDefined();
    expect(expectedComment?.body, 'Check comment body').toBe('test comment from user ' + testUser.user.email);
    expect(expectedComment?.author.username, 'Check comment author').toBe(testUser.user.username);
    return await commentsList;
  });

  await base.step('Delete comment', async () => {
    await apiClient.deleteComment(createArticleresponse.slug, createdCommentResponse.comment.id, testUser.user.token);
    const commentsAfterDelete = await apiClient.getComments(createArticleresponse.slug, testUser.user.token);
    expect(commentsAfterDelete.comments.length, 'Comments count should be 0').toBe(0);
  });
});
