var delay_tab = 300,
	delay_show_mm = 300,
	delay_hide_mm = 300;
$("body").append(getFullscreenBg());
$.fn.initMM = function() {
	var a = {
		$mobilemenu: $(".panel-menu"),
		mm_close_button: "Close",
		mm_back_button: "Back",
		mm_breakpoint: 768,
		mm_enable_breakpoint: false,
		mm_mobile_button: false,
		remember_state: false,
		second_button: false,
		init: function(b, d) {
			var c = this;
			if(!c.$mobilemenu.length) {
				console.log('You not have <nav class="panel-menu">menu</nav>. See Documentation');
				return false
			}
			arguments[1] != undefined && c.parse_arguments(d);
			c.$mobilemenu.parse_mm(a);
			c.$mobilemenu.init_mm(a);
			c.mm_enable_breakpoint && c.$mobilemenu.check_resolution_mm(a);
			b.mm_handler(a)
		},
		parse_arguments: function(c) {
			var b = this;
			if(Object(c).hasOwnProperty("menu_class")) {
				b.$mobilemenu = $("." + c.menu_class)
			}
			$.each(c, function(d, e) {
				switch(d) {
					case "right":
						e && b.$mobilemenu.addClass("mm-right");
						break;
					case "close_button_name":
						b.mm_close_button = e;
						break;
					case "back_button_name":
						b.mm_back_button = e;
						break;
					case "width":
						b.$mobilemenu.css("width", e);
						break;
					case "breakpoint":
						b.mm_breakpoint = e;
						break;
					case "enable_breakpoint":
						b.mm_enable_breakpoint = e;
						break;
					case "mobile_button":
						b.mm_mobile_button = e;
						break;
					case "remember_state":
						b.remember_state = e;
						break;
					case "second_button":
						b.second_button = e;
						break
				}
			})
		},
		show_button_in_mobile: function(b) {
			var c = this;
			if(c.mm_mobile_button) {
				window.innerWidth > c.mm_breakpoint ? b.hide() : b.show();
				$(window).resize(function() {
					window.innerWidth > c.mm_breakpoint ? b.hide() : b.show()
				})
			}
		}
	};
	a.init($(this), arguments[0]);
	a.show_button_in_mobile($(this))
};
$.fn.check_resolution_mm = function(b) {
	var a = $(this);
	$(window).resize(function() {
		if(!$("body").hasClass("mm-open") || !a.hasClass("mmitemopen")) {
			return false
		}
		window.innerWidth > b.mm_breakpoint && a.closemm(b)
	})
};
$.fn.mm_handler = function(a) {
	$(this).click(function(b) {
		b.preventDefault();
		a.$mobilemenu.openmm()
	});
	if(a.second_button != false) {
		$(a.second_button).click(function(b) {
			b.preventDefault();
			a.$mobilemenu.openmm()
		})
	}
};
$.fn.parse_mm = function(h) {
	var c = $(this).clone(),
		d = $(get_mm_parent()),
		b = false,
		g = 0,
		f = false,
		a = false,
		e;
	$(this).empty();
	c.find("a").each(function() {
		f = $(this);
		e = f.parent().find("ul").first();
		if(e.length) {
			g++;
			e.prepend("<li></li>").find("li").first().append(f.clone().addClass("mm-original-link"));
			f.attr("href", "#mm" + g).attr("data-target", "#mm" + g).addClass("mm-next-level")
		}
	});
	c.find("ul").each(function(i) {
		a = false;
		b = $(get_mm_block()).attr("id", "mm" + i).append($(this));
		if(i == 0) {
			b.addClass("mmopened").addClass("mmcurrent").removeClass("mmhidden");
			a = getButtonClose(c.find(".mm-closebtn").html(), h.mm_close_button);
			b.find("ul").first().prepend(a)
		} else {
			a = getButtonBack(c.find(".mm-backbtn").html(), h.mm_back_button);
			b.find("ul").first().prepend(a)
		}
		d.append(b)
	});
	$(this).append(d)
};
$.fn.init_mm = function(b) {
	var a = $(this);
	a.find("a").each(function() {
		$(this).click(function(g) {
			var f = $(this);
			var d = false;
			var c = false;
			var h = "";
			if(f.hasClass("mm-next-level")) {
				g.preventDefault();
				h = f.attr("href");
				c = a.find(".mmcurrent");
				c.addClass("mmsubopened").removeClass("mmcurrent");
				a.find(h).removeClass("mmhidden");
				setTimeout(function() {
					a.find(h).scrollTop(0).addClass("mmcurrent").addClass("mmopened")
				}, 0);
				setTimeout(function() {
					c.addClass("mmhidden")
				}, delay_tab);
				return false
			}
			if(f.hasClass("mm-prev-level")) {
				g.preventDefault();
				h = f.attr("href");
				c = a.find(".mmcurrent");
				c.removeClass("mmcurrent").removeClass("mmopened");
				a.find(".mmsubopened").last().removeClass("mmhidden").scrollTop(0).removeClass("mmsubopened").addClass("mmcurrent");
				setTimeout(function() {
					c.addClass("mmhidden")
				}, delay_tab);
				return false
			}
			if(f.hasClass("mm-close")) {
				a.closemm(b);
				return false
			}
		})
	});
	$(".mm-fullscreen-bg").click(function(c) {
		c.preventDefault();
		a.closemm(b)
	})
};
$.fn.openmm = function() {
	var a = $(this);
	a.show();
	setTimeout(function() {
		$("body").addClass("mm-open");
		a.addClass("mmitemopen");
		$(".mm-fullscreen-bg").fadeIn(delay_show_mm)
	}, 0)
};
$.fn.closemm = function(b) {
	var a = $(this);
	a.addClass("mmhide");
	$(".mm-fullscreen-bg").fadeOut(delay_hide_mm);
	setTimeout(function() {
		mm_destroy(a, b)
	}, delay_hide_mm)
};

function mm_destroy(a, b) {
	if(!b.remember_state) {
		a.find(".mmpanel").toggleClass("mmsubopened mmcurrent mmopened", false).addClass("mmhidden");
		a.find("#mm0").addClass("mmopened").addClass("mmcurrent").removeClass("mmhidden")
	}
	a.toggleClass("mmhide mmitemopen", false).hide();
	$("body").removeClass("mm-open")
}

function get_mm_parent() {
	return '<div class="mmpanels"></div>'
}

function get_mm_block() {
	return '<div class="mmpanel mmhidden">'
}

function getButtonBack(b, a) {
	b = b == undefined ? a : b;
	return '<li><a href="#" data-target="#" class="mm-prev-level">' + b + "</a></li>"
}

function getButtonClose(b, a) {
	b = b == undefined ? a : b;
	return '<li class="mm-close-parent"><a href="#close" data-target="#close" class="mm-close">' + b + "</a></li>"
}

function getFullscreenBg() {
	return '<div class="mm-fullscreen-bg"></div>'
};