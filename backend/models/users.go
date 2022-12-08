package models

import (
	"github.com/google/uuid"
	"github.com/jackc/pgtype"
	"gorm.io/gorm"
)

type UserRepo struct {
	DB *gorm.DB
}

func UserRepoInterface(db *gorm.DB) *UserRepo {
	return &UserRepo{DB: db}
}

// Users
type User struct {
	BaseModel
	UserID uuid.UUID    `json:"userID"`                  // Store the internal UUID for that user
	Data   pgtype.JSONB `json:"data" gorm:"column:data"` // Store additional metadata for users
}

// type DBUser struct {
// 	Avatar           string    `json:"avatar,omitempty"`
// 	Birthday         time.Time `json:"birthday,omitempty"`
// 	Email            string    `json:"email,omitempty"`
// 	FirstName        string    `json:"firstName,omitempty"`
// 	LastName         string    `json:"lastName,omitempty"`
// 	SubscriptionTier string    `json:"subscriptionTier,omitempty"`
// }

func (repo *UserRepo) CreateUser(payload User) error {
	u := User{}

	err := u.Data.Set(payload)

	if err != nil {
		return err
	}

	repo.DB.Updates(&u)

	return nil
}
