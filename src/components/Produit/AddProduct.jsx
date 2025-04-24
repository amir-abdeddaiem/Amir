import React from "react";
posts: [
  {
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    description: "",
    stock: "",
    quantity: "",
    user: "",
  },
],
  function AddProduct() {
    // Naviguer vers la page /about

    return (
      <div className="space-y-4">
        {user.posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{post.content}</p>
              <div className="mt-2 flex justify-between text-sm text-gray-500">
                <span>❤️ {post.likes} likes</span>
                <span>💬 {post.comments} comments</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

export default AddProduct;
