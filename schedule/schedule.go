package schedule

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Connect(uri string) *mongo.Client {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI((uri)))
	if err != nil {
		panic(err)
	}
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()
	return client
}

type Qhandler struct {
	ctx context.Context
}

func NewQhandler() *Qhandler {
	return &Qhandler{}
}
func (q *Qhandler) Query(client *mongo.Client, t string) {
	q.ctx = context.TODO()
}
