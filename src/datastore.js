let ssID = '13-gE9sbBlPyHoRxaElJxutzsYHOsNXnPfZCRmBJkUBs';

// Google Sheet JSON item pathing
const key_date = "gsx$date";
const key_brother = "gsx$brothername";
const key_pledge = "gsx$pledge";
const key_type = "gsx$type";
const key_count = "gsx$count";
const key_desc = "gsx$desc";
const key_approved = "gsx$approved";

const key_cell = "gs$cell";
const key_col_count = "gs$colCount";

const txt = "$t";

const marks_index = 1;
const pledges_index = 2;

class DataStore {

    // Finds the pledge assosciated with a mark and returns that pledge,
    // creates a new pledge and returns that if not found in input array
    findPledge(pledges, name) {
        //console.log(JSON.stringify(pledges), name)
        
        for (let i in pledges) {
            if (pledges[i].name === name)
                return pledges[i];
        }
        
        let new_pledge = new Pledge(name);
        pledges.push(new_pledge);
        return new_pledge;
    }

    async getPledges() {
        let raw = await fetch(`https://spreadsheets.google.com/feeds/cells/${ssID}/${pledges_index}/public/values?alt=json`,
            {
                    credentials: 'omit'
            });

        let sheet = await raw.json();

        let pc = [];

        for (let i = 1; i < sheet.feed[key_col_count]["$t"]; i++)
            pc.push(new Pledge(sheet.feed.entry[i].content["$t"]));

        return pc;
    }

    async getMarks() {
        
        let pc = await this.getPledges();

        let raw = await fetch(`https://spreadsheets.google.com/feeds/list/${ssID}/${marks_index}/public/values?alt=json`,
                {
                    credentials: 'omit'
                }
            );
        let sheet = await raw.json();
        
        sheet.feed.entry.forEach(entry => {
            let mark = new Mark(entry);
            this.findPledge(pc, mark.pledge).marks.push(mark);
        });

        return pc;
    }
}

class Mark {
    constructor(entry) {
    this.date = entry[key_date][txt];
    this.brother = entry[key_brother][txt];
    this.pledge = entry[key_pledge][txt];
    this.type = entry[key_type][txt];
    this.count = parseInt(entry[key_count][txt]);
    this.desc = entry[key_desc][txt];
    this.approved = entry[key_approved][txt];
    }
}

class Pledge {
    constructor(name) {
    this.name = name;
    this.marks = [];
    }

    getTotal(type) {
        let total = 0;
        for (let i in this.marks) {
            if (this.marks[i].type === type)
                total += this.marks[i].count;
        }

        return total;
    }
}

export default new DataStore()