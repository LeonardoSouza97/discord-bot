module.exports = (sequelize, DataTypes) => {
    const Config = sequelize.define('Config', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        token: DataTypes.STRING,
        client_id: DataTypes.STRING,

    }, {
            freezeTableName: true,
            timestamps: false
        });

    return Config;
}