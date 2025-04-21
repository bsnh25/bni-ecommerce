1. npm i sequelize pg
2. npm i -D sequelize-cli
3. npx sequelize init
4. edit config (usr, dialect, db)
5. buat database => npx sequelize db:create
6. buat table nya

   - npx sequelize model:generate --name User --attributes name:string,email:string,password:string,role:string
   - npx sequelize model:generate --name Product --attributes name:string,price:integer
   - npx sequelize model:generate --name Purchase --attributes userId:integer,productId:integer

7. Create Static Accociate (untuk hubungkan FK antar table) di table many-nya (User dan Product) & tulis lagi di table Purchase

   - HasOne (One2One)
   - belongsTo (One2One)
   - HasMany (Many2Many)
   - belongsToMany (Many2Many)

8. migrate -> npx sequelize db:migrate
9. untuk visualisasi FK tambahkan di migration
   references: {
   model: "Users",
   key: "id",
   },
   onUpdate: "CASCADE",
   onDelete: "CASCADE",
10. terus di undo -> (npx sequelize db:migrate:undo:all) dan (migrate lagi)

