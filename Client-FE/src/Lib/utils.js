export function formatMsgTime(createdAt){
return new Date(createdAt).toLocaleTimeString("en-US",{
    hour:"2-digit",
    minute:"2-digit",
    hour12:false,
})
}