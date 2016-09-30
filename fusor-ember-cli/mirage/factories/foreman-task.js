/*
  This is an example factory definition.

  Create more files in this directory to define additional factories.
*/
import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  id(i) {
    return 'foreman_uuid_9a2b47f2-4006__' + i;
  },
  label: 'Actions::Katello::ContentView::CapsuleGenerateAndSync',
  pending: false,
  username: 'admin',
  startedAt: "2016-05-15T12:33:19.000+03:00",
  endedAt: "2016-05-15T12:33:19.000+03:00",
  progress: '0.7',
  state: 'pending',
  result: 'success',
  externalId: "227f45c4-3faa-4ed7-a0ee-72e3af9f168e",
  repository: null
});
