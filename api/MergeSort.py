import numpy as np

def mergeSort2(list):
    if len(list) > 1:
        mid = len(list) // 2
        left = mergeSort(list[:mid])
        right = mergeSort(list[mid:])
        sortedList = []

        rightLen = len(right)
        leftLen = len(left)
        while rightLen > 0 and leftLen > 0:
            if left[0] < right[0]:
                print(left[0])
                sortedList.append(left.pop(0))
                leftLen-=1
            else:
                sortedList.append(right.pop(0))
                rightLen-=1


        while leftLen > 0:
            sortedList.append(left.pop(0))
            leftLen -=1
        while rightLen > 0:
            sortedList.append(right.pop(0))
            rightLen -=1
        print(sortedList)
        return sortedList
    return list

def mergeSort(myList):
    if len(myList) > 1:
        mid = len(myList) // 2
        left = myList[:mid]
        right = myList[mid:]

        # Recursive call on each half
        mergeSort(left)
        mergeSort(right)

        # Two iterators for traversing the two halves
        i = 0
        j = 0
        
        # Iterator for the main list
        k = 0
        
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
              # The value from the left half has been used
              myList[k] = left[i]
              # Move the iterator forward
              i += 1
            else:
                myList[k] = right[j]
                j += 1
            # Move to the next slot
            k += 1

        # For all the remaining values
        while i < len(left):
            myList[k] = left[i]
            i += 1
            k += 1

        while j < len(right):
            myList[k]=right[j]
            j += 1
            k += 1

arr = np.random.randint(1, 500, 1000)
newArr = mergeSort2(arr)
print(newArr)