class Initial < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :email, null: false, index: { unique: true }
      t.string :screen_name, null: false, index: { unique: true }
      t.string :name, null: false, index: true
      t.timestamps null: false
      t.index :created_at
      t.index :updated_at
    end

    create_table :user_auth_passwords do |t|
      t.references :user, null: false,
        index: { unique: true },
        foreign_key: { on_update: :cascade, on_delete: :cascade }
      t.string :password_digest, null: false, index: true
      t.timestamps null: false
      t.index :created_at
      t.index :updated_at
    end

    create_table :histories, id: false do |t|
      t.string :id, null: false, primary: true
      t.date :date, null: false, index: true
      t.string :title, null: false, index: true
      t.integer :amount, null: false
      t.string :institution, null: false, index: true
      t.boolean :is_transfer, null: false, index: true
      t.json :data
      t.timestamps null: false
      t.index :created_at
      t.index :updated_at
    end
    execute "ALTER TABLE histories ADD PRIMARY KEY (id);"

    create_table :filters do |t|
      t.string :name, null: false, index: { unique: true }
      t.string :condition, null: false
      t.timestamps null: false
      t.index :created_at
      t.index :updated_at
    end

    create_table :tags do |t|
      t.string :name, null: false, index: { unique: true }
      t.timestamps null: false
      t.index :created_at
      t.index :updated_at
    end

    create_table :history_tags do |t|
      t.references :history, type: :string, null: false, foreign_key: { on_delete: :cascade }
      t.references :tag, null: false, foreign_key: { on_delete: :cascade }
      t.timestamps null: false
      t.index :created_at
      t.index :updated_at
    end
  end
end
