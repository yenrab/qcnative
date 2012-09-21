//
//  User.h
//  CoreDataExample
//
//  Created by Lee Barney on 9/21/12.
//  Copyright (c) 2012 Lee Barney. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>


@interface User : NSManagedObject

@property (nonatomic, retain) NSString * id;
@property (nonatomic, retain) NSDate * insertTime;
@property (nonatomic, retain) NSString * name;

@end
