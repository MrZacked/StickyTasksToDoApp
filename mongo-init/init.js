db = db.getSiblingDB('stickytasks');

db.createUser({
  user: 'stickytasks',
  pwd: 'stickytaskspassword',
  roles: [
    {
      role: 'readWrite',
      db: 'stickytasks'
    }
  ]
});

db.createCollection('todos');

print('Database initialized'); 