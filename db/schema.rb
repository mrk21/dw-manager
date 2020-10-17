# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_09_22_085058) do

  create_table "filters", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "condition", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["created_at"], name: "index_filters_on_created_at"
    t.index ["name"], name: "index_filters_on_name", unique: true
    t.index ["updated_at"], name: "index_filters_on_updated_at"
  end

  create_table "histories", id: :string, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.date "date", null: false
    t.string "title", null: false
    t.integer "amount", null: false
    t.string "institution", null: false
    t.boolean "is_transfer", null: false
    t.json "data"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["created_at"], name: "index_histories_on_created_at"
    t.index ["date"], name: "index_histories_on_date"
    t.index ["institution"], name: "index_histories_on_institution"
    t.index ["is_transfer"], name: "index_histories_on_is_transfer"
    t.index ["title"], name: "index_histories_on_title"
    t.index ["updated_at"], name: "index_histories_on_updated_at"
  end

  create_table "history_tags", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "history_id", null: false
    t.bigint "tag_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["created_at"], name: "index_history_tags_on_created_at"
    t.index ["history_id"], name: "index_history_tags_on_history_id"
    t.index ["tag_id"], name: "index_history_tags_on_tag_id"
    t.index ["updated_at"], name: "index_history_tags_on_updated_at"
  end

  create_table "tags", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["created_at"], name: "index_tags_on_created_at"
    t.index ["name"], name: "index_tags_on_name", unique: true
    t.index ["updated_at"], name: "index_tags_on_updated_at"
  end

  add_foreign_key "history_tags", "histories", on_delete: :cascade
  add_foreign_key "history_tags", "tags", on_delete: :cascade
end
