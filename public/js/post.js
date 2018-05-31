function Post(){
    function bindEvent(){
        $(".post_edit").click(function(e){
            var params = {
                id: $(".id").val(),
                title: $(".title").val(),
                content: tinymce.get("content").getContent(),
                author: $(".author").val()
            };
            var base_url = location.protocol + "//" + document.domain + ":" + location.port;
            $.ajax ({
                url: base_url + "/admin/post/edit",
                type: "PUT", //đẩy lên theo phương thức PUT
                data: params,
                dataType: json,
                success: function(res){
                    if(res && res.status_code == 200 ){
                        location.reload();
                    }
                }
            });
        });
    }
    bindEvent();
}
$(document).ready(function(){
    new Post();
})