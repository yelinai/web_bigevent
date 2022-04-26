$(function() {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
        // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                //使用模板引擎渲染文章列表(写入一个模板的id 和 需要渲染的数据)
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

            }
        })
    }

    // 为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            // 通过DOM操作拿到script脚本里面的html元素，即表单结构
            content: $('#dialog-add').html()
        })
    })

    // 通过代理的方式为form-add表单绑定一个submit事件，让body来代理form-add绑提交事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                // 重新渲染列表数据，调用initArtCateList()函数
                initArtCateList()
                layer.msg('新增分类成功！')
                    // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }

        })
    })


    // 通过代理的形式，为btn-edit 按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            // 通过DOM操作拿到script脚本里面的html元素，即表单结构
            content: $('#dialog-edit').html()
        })

        // 拿到对应一行的id
        var id = $(this).attr('data-id')
            // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })

    })

    // 通过代理的形式，为弹出层修改分类表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
            // 发起请求把数据发送到服务器
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                    // 重新渲染列表数据
                initArtCateList()
            }
        })
    })

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        //拿到点击之后对应一行的id  ，attr('data-id')自定义属性的值
        var id = $(this).attr('data-id')
            // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                        // 重新渲染列表数据
                    initArtCateList()
                }
            })

        })
    })

})