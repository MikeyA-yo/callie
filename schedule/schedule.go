package schedule

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Connect(uri string) *mongo.Client {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI((uri)))
	if err != nil {
		panic(err)
	}
	//To use it in disconnect function
	// defer func() {
	// 	if err := client.Disconnect(context.TODO()); err != nil {
	// 		panic(err)
	// 	}
	// }()
	return client
}

type Qhandler struct {
	ctx    context.Context
	client *mongo.Client
}

func NewQhandler(uri string) *Qhandler {
	return &Qhandler{client: Connect(uri), ctx: context.TODO()}
}
func (q *Qhandler) Query(client *mongo.Client, t string, coll string) {

	collection := client.Database("callie").Collection(coll)
	if t == "find" {
		collection.FindOne(q.ctx, bson.D{{Key: "roomId", Value: "n"}})
	}
}

type RoomDoc struct {
	RoomId     string `bson:"roomId"`
	ExpiryDate int    `bson:"expiryDate"`
	Owner      string `bson:"owner"`
}

func (q *Qhandler) Find(filter, value string) RoomDoc {
	var result RoomDoc
	client := q.client
	findRes := client.Database("callie").Collection("rooms").FindOne(q.ctx, bson.D{{Key: filter, Value: value}})
	findRes.Decode(&result)

	return result
}
