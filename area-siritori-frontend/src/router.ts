// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client';

export type Path = `/` | `/play` | `/room/:room_id` | `/user` | `/user/:user_id` | `/user/add`;

export type Params = {
  '/room/:room_id': { room_id: string };
  '/user/:user_id': { user_id: string };
};

export type ModalPath = never;

export const { Link, Navigate } = components<Path, Params>();
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>();
export const { redirect } = utils<Path, Params>();
