export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3 || ~~(day / 10) === 1) ? 0 : day % 10];
    return `${day}${suffix} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
}