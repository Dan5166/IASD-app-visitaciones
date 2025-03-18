"use client"

export const setInLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
}