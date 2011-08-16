//
//  ListUsersVCO.m
//  QC Example
//
//  Created by Lee Barney on 3/15/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "ListUsersVCO.h"
#import "User.h"


@implementation ListUsersVCO


+ (BOOL) handleIt:(NSMutableDictionary*) parameters{
    UITextView *resultView = [parameters objectForKey:@"resultDisplay"];
    NSMutableString *theText = [NSMutableString stringWithCapacity:0];
	[theText appendString:@"\tUUID\t\t\t\t\t\t\t\t\t\t\tuname\n\n"];
    
    //NSArray *allResults = [parameters objectForKey:@"BCOresults"];
    NSArray *users = [parameters objectForKey:@"userList"];
    int numResults = [users count];
    for (int i = 0; i < numResults; i++) {
        User *aUser = [users objectAtIndex:i];
        [theText appendFormat:@"\t%@\t\t\t\t%@\n",
         aUser.id, aUser.name];
    }
	resultView.text = theText;
    return QC_STACK_EXIT;
}

@end
