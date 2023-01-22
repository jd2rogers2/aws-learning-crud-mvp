exports.up = (pgm) => {
    pgm.createTable('widgets', {
        id: 'id',
        name: { type: 'varchar(100)', notNull: true },
        description: { type: 'text', notNull: true },
        price: { type: 'decimal', notNull: true },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
};
