package middleware

import (
	"context"
	"net/http"

	"github.com/sirupsen/logrus"
)

func GetUser(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userID := r.Header.Get("USER")
		ctx := r.Context()
		if userID == "" {
			errString := "Missing authentication"
			w.WriteHeader(http.StatusForbidden)
			w.Write([]byte(errString))
			logrus.Errorf("missing the %s header", "USER")
			return
		} else {
			ctx = context.WithValue(ctx, "USER", userID)
		}

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
