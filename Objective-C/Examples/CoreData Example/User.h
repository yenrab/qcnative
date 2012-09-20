//
//  User.h
//  QC Base Example
//
//  Created by Lee Barney on 3/28/11.
//  Copyright (c) 2011 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>


@interface User : NSManagedObject {
@private
}
@property (nonatomic, retain) NSString * id;
@property (nonatomic, retain) NSDate * insertTime;
@property (nonatomic, retain) NSString * name;

@end
