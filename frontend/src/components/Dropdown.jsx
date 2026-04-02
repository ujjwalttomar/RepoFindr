//              RepoFindr/frontend/src/components/Dropdown.jsx


import {useState} from "react";


export default function SearchableDropdown({
    
    options,
    selected,

}){
    const [open,setOpen] = useState(false);
    const [search, setSearch] = useState("");

    

    function FilteredList(){
        if(!search)return options;
       return options.filter((option)=>option.label.toLowerCase().includes(search.toLowerCase()))
    }
    const visibleOptions = FilteredList();

    function RenderList(){
        visibleOptions.map(<p>option.label</p>)
    }
    function HandleClick(){
        if(open == false)setOpen(true);
        RenderList();

    }
    function HandleChange(){
        (e)=>{setSearch(e.target.value)}
        RenderList();
    }

    return(
        <>
        <input value={search} onclick={HandleClick} onChange = {HandleChange(e)}></input>
        </>
    )

}