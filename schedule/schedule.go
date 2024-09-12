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
	return client
}

type Qhandler struct {
	ctx    context.Context
	client *mongo.Client
}

func NewQhandler(uri string) *Qhandler {
	return &Qhandler{client: Connect(uri), ctx: context.TODO()}
}
func (q *Qhandler) Disconnect() {
	if err := q.client.Disconnect(q.ctx); err != nil {
		panic(err)
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
	e := findRes.Decode(&result)
	if e != nil {
		if e == mongo.ErrNoDocuments {
			return RoomDoc{RoomId: "", ExpiryDate: 0, Owner: ""}
		} else {
			panic(e)
		}
	}
	return result
}

func (q *Qhandler) Insert(value interface{}) *mongo.InsertOneResult {
	res, e := q.client.Database("callie").Collection("rooms").InsertOne(q.ctx, value)
	if e != nil {
		panic(e)
	}
	return res
}

func (q *Qhandler) Delete(filter, value string) *mongo.DeleteResult {
	res, e := q.client.Database("callie").Collection("rooms").DeleteOne(q.ctx, bson.D{{Key: filter, Value: value}})
	if e != nil {
		panic(e)
	}
	return res
}

// returns true if room was successfully created else false, if the roomid already exists
func Schedule(expiry int, owner, roomid, uri string) bool {
	queryHandler := NewQhandler(uri)
	defer queryHandler.Disconnect()
	result := queryHandler.Find("owner", owner)
	if len(result.RoomId) == 0 {
		queryHandler.Insert(RoomDoc{RoomId: roomid, Owner: owner, ExpiryDate: expiry})
		return true
	}
	return false
}
func Schedulev2(expiry int, owner, roomid, uri string) bool {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI((uri)))
	if err != nil {
		panic(err)
	}
	_, e := client.Database("callie").Collection("rooms").InsertOne(context.TODO(), RoomDoc{RoomId: roomid, Owner: owner, ExpiryDate: expiry})
	if e != nil {
		if e == mongo.ErrClientDisconnected {
			panic(e)
		}
	}
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()
	return true
}
func DeleteSchedule(roomid, uri string) {
	queryHandler := NewQhandler(uri)
	defer queryHandler.Disconnect()
	queryHandler.Delete("roomId", roomid)
}
