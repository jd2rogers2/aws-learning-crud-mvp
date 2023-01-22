exports.up = (pgm) => {
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
};
