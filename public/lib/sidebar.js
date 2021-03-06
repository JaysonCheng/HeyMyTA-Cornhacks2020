Vue.component('sidebar-item', {
    props: {
        item: Object
    },
    template: `
      <a>
        <span class="ml-1"><span :class="'dot ' + (item.assigned ? 'dot-assigned' : (!item.online ? 'dot-offline' : ''))"></span>{{ item.full_name }}</span>
      </a>
  `
});

let vueSidebar = new Vue({
    el: '#chat-sidebar',
    data: {
        teachers: [],
        students: [],
    },
    methods: {
        setCourseData: function (c) {
            const online = {}, assigned = {};
            c.online.forEach(id => online[id] = true);
            Object.values(c.tickets).forEach(v => {
                if (v.assignee) assigned[v.assignee] = true
            });
            this.students = [];
            this.teachers = [];
            for (const [k, v] of Object.entries(c.course_info.members)) {
                const entry = {
                    user_id: k,
                    full_name: c.users_info[k].full_name,
                    online: !!online[k],
                    assigned: !!assigned[k]
                };
                if (v === "Learner") {
                    this.students.push(entry);
                } else {
                    this.teachers.push(entry);
                }
                // console.log(this.students, this.teachers);
            }
        },
    }

});

vueSidebar.setCourseData(P.course);

xlib.socket.on('new_course_status', function (msg) {
    vueSidebar.setCourseData(msg);
});