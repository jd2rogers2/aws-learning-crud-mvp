const up = (pgm) => {
    pgm.createTable('users', {
        id: 'id',
        email: { type: 'varchar(100)', notNull: true },
        password: { type: 'varchar(100)', notNull: true },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.addConstraint('users', 'unique_user_emails', { unique: ['email']});
};

module.exports = {
    up,
};
