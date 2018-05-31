var express = require("express");
var user_md = require("../models/user");
var post_md = require("../models/post");

var helper = require("../helpers/helper");

var router = express.Router();
router.get("/",function(req,res){
    // res.json({"message": "this is admin page"});
    if(req.session.user){
        var data = post_md.getAllPost(); //hàm này return 1 promise
        data.then(function(posts){
            data = {
                posts: posts,
                error: false
            };
            res.render("admin/dashboard",{data: data});
        }).catch(function(err){
            res.render("admin/dashboard",{data: {error: true}});
        })
    }else{
        res.redirect("/admin/signin");
    }
}); 

router.get("/signup",function(req,res) {
	res.render("signup",{data: {}});
}); // them router de chay file signup

router.post("/signup",function(req,res){
        var user = req.body;
        if(user.email.trim().length == 0){
            res.render("signup",{data:{Error: "Email is required"}});
        }
        if(user.passwd != user.repasswd && user.passwd.trim().length == 0 ){
            res.render("signup",{data: {Error: "Password is not Match"}});
    };

    var password = helper.hash_password(user.passwd);
    user = {
        email: user.email,
        password: password,
        first_name: user.firtname,
        last_name: user.lastname
    };
    
    var result = user_md.addUser(user);
    result.then(function(data){
        //  res.json({message: "Insert success"});
        res.redirect("signin")
    })
    .catch(function(error){
        res.render("signup",{data: {Error: "error"}});
    });
});
    router.get("/signin",function(req,res) {
        res.render("signin",{data: {}});
    }); // them router de chay file signin

    router.post("/signin",function(req,res){
        params = req.body;
        if(params.email.trim().length == 0 ){
            res.render("signin",{data : { error: "please enter an email."}});
        }else {
            var data = user_md.getUserByEmail(params.email);
            if(data){
                data.then(function(users){
                    var user = users[0];
                    var pass = helper.hash_password(user.password);
                    var status = helper.compare_password(params.password,pass);
                    if(!status){
                        res.render("signin",{data: {error: "Password wrong"}});
                    }else{
                        req.session.user = user; // chặn session thử xem user có đăng nhâp hay chưa
                        console.log(req.session.user);
                        res.redirect("/admin/");
                    }
                });
            }else{
                res.render("signin",{data: {Error: "user not exist"}});
            }
        }
    });

    router.get("/post/new",function(req,res){
        if(req.session.user){
            res.render("admin/post/new",{data: {error: false}});
        }else{
            res.redirect("/admin/signin");
        }
        
    }); //thêm router cho cho new
    router.post("/post/new",function(req,res){
        var params = req.body;

        if(params.title.trim().length == 0){
            res.render("admin/post/new",{data: {error: "Please enter a title"}});
        }
        else{
            var now = new Date();
            params.created_at = now;
            params.updated_at  = now;   
            var data = post_md.addPost(params);
    
            data.then(function(result){
                res.redirect("/admin");
    
            }).catch(function(err){
                res.render("admin/post/new",{data: {error: "Could not insert post"}});
            });
        } 
    });
    router.get("post/edit/:id",function(req,res){
        if(req.session.user){
            params=req.params;
            id = params.id;
            var data = post_md.getPostById(id);
            if(data){
                data.then(function(posts){
                    var post = posts[0];
                    var data = {
                        post: post,
                        error :false
                    }
                    res.render("admin/post/edit",{data: data});
                }).catch(function(err){
                    var data = {
                        error: "Coult not get POst by id"
                    }
                    res.render("admin/post/edit",{data: data});
                })
            }
            else{
                var data = {
                    error: "Coult not get POst by id"
                } 
                res.render("admin/post/edit",{data: data});
            }
        }else{
            res.redirect("/admin/signin");
        }
        
    });
    router.put("/post/edit",function(req,res){
        if(req.session.user){
            var params = req.body;
            var data = post_md.updatePost(params);


            if(!data){
                res.json({status_code: 500})
            }
            else{
                data.then(function(result){
                    res.json({status_code: 200});
                }).catch(function(err){
                    res.json({status_code: 500});
                });
            }
        }else{
            res.redirect("/admin/signin");
        }
        
    });
    router.get("/post",function(req,res){
        if(req.session.user){
            res.redirect("/admin");
        }else{
            res.redirect("/admin/signin");
        }
        
    });
    router.get("/user",function(req,res){
        if(req.session.user){
            var data = user_md.getAllUser();
            data.then(function(users){
                var data = {
                    users : users,
                    err: false
                };
                res.render("admin/user",{data: data});
            }).catch(function(err){
                var data = {
                    err: "Could not get user info"
                }
                res.render("admin/user",{data: data});
            })  
        }else{
            res.redirect("/admin/signin");
        }
        
    })

module.exports = router;