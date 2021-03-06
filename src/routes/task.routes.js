'use strict';

import { Router } from 'express';
import { check } from 'express-validator';

import { createTaskRules, protectWithJwt, validate } from '../middlewares';
import {
  idExistInDB,
  isSameUserOrPartnerTask,
  isValidPriority,
} from '../helpers';
import {
  createTask,
  deleteTask,
  getTask,
  toggleState,
  updateTask,
} from '../controllers';

const router = Router();

router.use(protectWithJwt);

router.route('/').post(
  [
    createTaskRules(),
    validate,
    check('project').custom((id, { req }) => idExistInDB(id, 'project', req)),
    validate,
  ],

  createTask
);

router
  .route('/:id')
  .get(
    [
      check('id', 'Invalid ID!').isMongoId(),
      validate,
      check('id').custom((id, { req }) => idExistInDB(id, 'task', req)),
      validate,
    ],

    getTask
  )
  .put(
    [
      check('id', 'Invalid ID!').isMongoId(),
      check('priority').custom(isValidPriority),
      check('id').custom((id, { req }) => idExistInDB(id, 'task', req)),
      validate,
    ],

    updateTask
  )
  .delete(
    [
      check('id', 'Invalid ID!').isMongoId(),
      validate,
      check('id').custom((id, { req }) => idExistInDB(id, 'task', req)),
      validate,
    ],

    deleteTask
  );

router.route('/state/:id').patch(
  [
    check('id', 'Invalid ID!').isMongoId(),
    validate,
    check('id').custom((id, { req }) =>
      isSameUserOrPartnerTask(id, 'task', req)
    ),
    validate,
  ],

  toggleState
);

export default router;
