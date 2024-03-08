export interface Movie {
    mid:    number;
    title:  string;
    year:   string;
    type:   string;
    poster: string;

    pid:    number;
    pname:  string;
    pimage: string;
    ptype:  string;
    pbirthday: string;
    pid_fk: string;
    mid_fk:string;
    actors:string;
    creator:string;
}