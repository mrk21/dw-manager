class Initial < ActiveRecord::Migration[6.0]
  def change
    create_table :histories, id: false do |t|
      t.string :id, null: false, primary: true
      t.date :date, null: false, index: true
      t.string :title, null: false, index: true
      t.integer :amount, null: false
      t.string :institution, null: false, index: true
      t.boolean :is_transfer, null: false, index: true
      t.json :data
      t.timestamps
      t.index :created_at
      t.index :updated_at
    end
    execute "ALTER TABLE histories ADD PRIMARY KEY (id);"

    create_table :filters do |t|
      t.string :name, null: false, index: true
      t.string :condition, null: false
      t.timestamps
      t.index :created_at
      t.index :updated_at
    end

    create_table :tags do |t|
      t.string :name, null: false, index: true
      t.timestamps
      t.index :created_at
      t.index :updated_at
    end

    create_table :history_tags do |t|
      t.references :history, type: :string, null: false, foreign_key: { on_delete: :cascade }
      t.references :tag, null: false, foreign_key: { on_delete: :cascade }
      t.timestamps
      t.index :created_at
      t.index :updated_at
    end
  end
end
